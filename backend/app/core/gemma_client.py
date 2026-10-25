"""
Thin async wrapper around the Google Generative AI SDK (Gemma/Gemini).
Swap this module out to point at a local Ollama instance if needed.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from typing import TYPE_CHECKING, Any

import google.generativeai as genai

from app.core.config import settings

if TYPE_CHECKING:
    from app.schemas.scheme import SchemeSchema

logger = logging.getLogger(__name__)

# Configure once at import time
if settings.google_api_key:
    try:
        genai.configure(api_key=settings.google_api_key)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not configure google.generativeai: %s", exc)


async def ask_gemma(prompt: str) -> str:
    """
    Send *prompt* to the configured Gemma/Gemini model and return the text response.
    Wraps the synchronous SDK call in asyncio.to_thread to prevent blocking the event loop.
    """
    if not settings.google_api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured in .env")

    model = genai.GenerativeModel(settings.gemma_model)
    response = await asyncio.to_thread(model.generate_content, prompt)
    if not response.text:
        raise RuntimeError("Empty response received from LLM")
    return response.text


# ---------------------------------------------------------------------------
# Fast Deterministic / Keyword-Based Need Matcher Fallback
# ---------------------------------------------------------------------------

def _deterministic_suggest(query: str, schemes: list[Any]) -> dict[str, Any]:
    """
    Keyword and attribute-based matching fallback that never crashes.
    Used when Gemini API key is missing, invalid, or hits rate limits.
    """
    q = query.lower()
    words = set(re.findall(r"\w+", q))

    # Infer demographic profile hints
    hints: dict[str, Any] = {}
    if any(w in words or w in q for w in ["farmer", "kisan", "crop", "crops", "agriculture", "farming", "krishi", "khet", "cultivator"]):
        hints["is_farmer"] = True
    if any(w in words or w in q for w in ["student", "college", "school", "scholarship", "study", "studying", "tuition", "degree"]):
        hints["is_student"] = True
    if any(w in words or w in q for w in ["daughter", "girl", "woman", "women", "female", "mahila", "beti", "mother", "sister", "widow"]):
        hints["gender"] = "female"
    elif any(w in words for w in ["man", "men", "male"]):
        hints["gender"] = "male"
    if any(w in words or w in q for w in ["bpl", "poor", "poverty", "low income", "garib", "ration card"]):
        hints["is_bpl"] = True
    if any(w in words or w in q for w in ["disability", "disabled", "handicap", "divyang", "pwd"]):
        hints["is_pwd"] = True

    # Check age numbers e.g. "I am 24", "age 19", "25 years old"
    age_match = re.search(r"\b(?:age|i am|aged|am)\s*(\d{1,2})\b", q)
    if age_match:
        try:
            val = int(age_match.group(1))
            if 5 <= val <= 90:
                hints["age"] = val
        except Exception:
            pass

    # Detect high-level needs
    detected_needs: list[str] = []
    if hints.get("is_farmer"):
        detected_needs.append("Agricultural & Farmer Income Support")
    if any(w in words or w in q for w in ["hospital", "treatment", "health", "medical", "ayushman", "disease", "surgery", "5 lakh", "lakh", "clinic", "doctor"]):
        detected_needs.append("Healthcare & Free Medical Treatment")
    if any(w in words or w in q for w in ["loan", "business", "vendor", "shop", "street", "collateral", "svanidhi", "mudra", "credit", "capital"]):
        detected_needs.append("Micro-Enterprise & Collateral-Free Credit")
    if any(w in words or w in q for w in ["daughter", "girl", "sukanya", "samriddhi", "marriage", "savings", "child"]):
        detected_needs.append("Girl Child Savings & Higher Education Security")
    if hints.get("is_student"):
        detected_needs.append("Student Scholarships & Educational Grants")
    if any(w in words or w in q for w in ["pension", "elderly", "senior", "retirement", "atal"]):
        detected_needs.append("Retirement Security & Guaranteed Pension")
    if any(w in words or w in q for w in ["house", "housing", "home", "awas", "pucca"]):
        detected_needs.append("Affordable Housing & Construction Aid")

    if not detected_needs:
        detected_needs.append("General Public Welfare & Financial Assistance")

    # Score each scheme
    scored_matches: list[dict[str, Any]] = []
    for s in schemes:
        score = 0.0
        s_name = (s.name or "").lower()
        s_short = (s.short_name or "").lower()
        s_desc = (s.description or "").lower()
        s_tags = [t.lower() for t in (s.tags or [])]
        s_benefits = " ".join([b.description.lower() for b in s.benefits] if isinstance(s.benefits, list) else [str(s.benefits).lower()])

        # Direct name match
        for w in words:
            if len(w) <= 2:
                continue
            if w in s_short:
                score += 0.4
            elif w in s_name:
                score += 0.25
            elif any(w in tag for tag in s_tags):
                score += 0.18
            elif w in s_desc:
                score += 0.08
            elif w in s_benefits:
                score += 0.06

        # Intent boost
        if hints.get("is_farmer") and (getattr(s.eligibility, "is_farmer_required", False) or "farming" in s_tags or "kisan" in s_name):
            score += 0.45
        if hints.get("is_student") and (getattr(s.eligibility, "is_student_required", False) or "scholarships" in s_tags or "student" in s_desc):
            score += 0.45
        if hints.get("gender") == "female" and (getattr(s.eligibility, "gender", "any") == "female" or "women" in s_tags or "girl" in s_desc):
            score += 0.45
        if "Healthcare & Free Medical Treatment" in detected_needs and ("health" in s_tags or "ayushman" in s_name or "medical" in s_desc):
            score += 0.50
        if "Micro-Enterprise & Collateral-Free Credit" in detected_needs and ("micro_credit" in s_tags or "loan" in s_desc or "svanidhi" in s_name):
            score += 0.50
        if "Girl Child Savings & Higher Education Security" in detected_needs and ("sukanya" in s_name or "daughter" in s_desc or "girl" in s_desc):
            score += 0.55

        # Cap score between 0.0 and 0.98
        relevance = min(round(max(score, 0.0), 2), 0.98)
        if relevance >= 0.25:
            # Generate personalized explanation
            benefit_summary = ""
            if isinstance(s.benefits, list) and s.benefits:
                b = s.benefits[0]
                benefit_summary = getattr(b, "description", str(b))
            else:
                benefit_summary = s.description[:120]

            why_rec = f"Directly addresses your need by offering {benefit_summary.rstrip('.')}."
            if s.short_name:
                why_rec = f"{s.short_name} matches your situation by providing {benefit_summary.rstrip('.')}."

            scored_matches.append({
                "scheme_id": s.scheme_id,
                "relevance_score": max(relevance, 0.65),  # ensure confidence for relevant matches
                "why_recommended": why_rec,
            })

    # Sort descending by relevance score
    scored_matches.sort(key=lambda m: m["relevance_score"], reverse=True)

    return {
        "understood_needs": detected_needs,
        "extracted_profile_hints": hints,
        "matches": scored_matches[:6],
    }


# ---------------------------------------------------------------------------
# Main Need-Based Suggestion Entry Point
# ---------------------------------------------------------------------------

async def suggest_schemes_for_need(query: str, schemes: list[Any]) -> dict[str, Any]:
    """
    Match user need with available schemes using Gemini with strict JSON output.
    Falls back gracefully to the deterministic keyword/tag matcher on any failure.
    """
    if not schemes:
        return {"understood_needs": [], "extracted_profile_hints": {}, "matches": []}

    # If no API key configured, use deterministic matcher directly
    if not settings.google_api_key or "your_" in settings.google_api_key.lower():
        logger.info("Using deterministic need-matcher (no API key configured)")
        return _deterministic_suggest(query, schemes)

    # Compact scheme catalog for LLM context
    schemes_summary: list[dict[str, Any]] = []
    for s in schemes:
        benefits_list = []
        if isinstance(s.benefits, list):
            for b in s.benefits:
                b_desc = getattr(b, "description", "")
                b_amt = getattr(b, "amount_inr", None)
                benefits_list.append(f"{b_desc} (Amount: INR {b_amt})" if b_amt else b_desc)
        else:
            benefits_list.append(str(s.benefits))

        schemes_summary.append({
            "scheme_id": s.scheme_id,
            "name": s.name,
            "short_name": getattr(s, "short_name", None),
            "description": s.description,
            "tags": getattr(s, "tags", []),
            "benefits": benefits_list,
            "target_criteria": {
                "gender": getattr(s.eligibility, "gender", "any"),
                "is_farmer": getattr(s.eligibility, "is_farmer_required", False),
                "is_student": getattr(s.eligibility, "is_student_required", False),
                "is_bpl": getattr(s.eligibility, "is_bpl_required", False),
                "is_pwd": getattr(s.eligibility, "is_pwd_required", False),
            },
        })

    prompt = f"""You are SchemeSaathi AI, an intelligent government welfare shortlister for Indian citizens.

CITIZEN'S STATED NEED OR SITUATION:
"{query}"

AVAILABLE SCHEMES CATALOG:
{json.dumps(schemes_summary, ensure_ascii=False, indent=2)}

TASK:
Analyze the citizen's query. Identify their core need, extract demographic hints, and rank the top matching schemes.
1. `understood_needs`: array of 1 to 3 clear, concise category tags (e.g. ["Agricultural Income Support", "Crop Loss Relief"]).
2. `extracted_profile_hints`: key-value map of any user demographics explicitly inferred from text. Allowed keys:
   - "is_farmer": boolean
   - "is_student": boolean
   - "gender": "male" | "female"
   - "age": integer
   - "is_bpl": boolean
   - "is_pwd": boolean
   - "annual_income_inr": number
   - "state": string
3. `matches`: array of schemes that genuinely solve or relate to this need, ordered from highest relevance to lowest. For each:
   - "scheme_id": exact ID string from catalog
   - "relevance_score": float between 0.50 and 1.0 (e.g. 0.95 for exact solution)
   - "why_recommended": 1-2 sentence personalized explanation explaining exactly how this scheme solves the citizen's need.

OUTPUT RULES:
- Output STRICT, VALID RAW JSON ONLY. No markdown formatting, no backticks, no extra explanations.
- Only include genuine matches (relevance >= 0.50). Max 6 schemes.

JSON FORMAT:
{{
  "understood_needs": ["..."],
  "extracted_profile_hints": {{}},
  "matches": [
    {{
      "scheme_id": "...",
      "relevance_score": 0.95,
      "why_recommended": "..."
    }}
  ]
}}"""

    try:
        response_text = await ask_gemma(prompt)
        cleaned = response_text.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)
        parsed = json.loads(cleaned)

        # Validate structure
        if isinstance(parsed, dict) and "matches" in parsed:
            # Ensure matched scheme_ids actually exist in our catalog
            valid_ids = {s.scheme_id for s in schemes}
            filtered_matches = []
            for m in parsed.get("matches", []):
                sid = m.get("scheme_id")
                if sid in valid_ids:
                    filtered_matches.append({
                        "scheme_id": sid,
                        "relevance_score": float(m.get("relevance_score", 0.75)),
                        "why_recommended": str(m.get("why_recommended", "")),
                    })
            if filtered_matches:
                return {
                    "understood_needs": parsed.get("understood_needs", ["Need-Based Recommendation"]),
                    "extracted_profile_hints": parsed.get("extracted_profile_hints", {}),
                    "matches": filtered_matches,
                }
    except Exception as exc:  # noqa: BLE001
        logger.warning("Gemini need-matching failed (%s), falling back to deterministic: %s", type(exc).__name__, exc)

    # Fallback to deterministic matcher
    return _deterministic_suggest(query, schemes)


"""
Stage 1 Scraper — BeautifulSoup + Gemma HTML-to-JSON
======================================================
Flow:
  1. Fetch raw HTML from a government portal URL via httpx
  2. Extract the main content block with BeautifulSoup (noise removal)
  3. Pass cleaned HTML to Gemma with a strict prompt → raw JSON string
  4. Parse + validate the JSON against SchemeSchema (Pydantic)
  5. Return a validated SchemeSchema object (or raise ScraperError)

This module NEVER makes eligibility decisions — it only structures data.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime, timezone
from typing import Any

import httpx
from bs4 import BeautifulSoup, Tag

from app.schemas.scheme import SchemeSchema
from app.core.config import settings
from app.core.gemma_client import ask_gemma

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Tags whose content is almost always noise on gov portals
_NOISE_TAGS = [
    "script", "style", "nav", "footer", "header",
    "aside", "form", "iframe", "noscript", "svg",
]

# We cap the text sent to Gemma to stay within token limits
_MAX_CHARS_TO_LLM = 12_000

# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------

class ScraperError(Exception):
    """Raised when scraping or schema validation fails."""


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _fetch_html(url: str, timeout: int = 20) -> str:
    """
    Fetch raw HTML from *url* using a browser-like User-Agent.
    Raises ScraperError on HTTP or network errors.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; SchemeNavigatorBot/1.0; "
            "+https://schemenavigator.gov.in/bot)"
        ),
        "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
    }
    try:
        response = httpx.get(url, headers=headers, timeout=timeout, follow_redirects=True)
        response.raise_for_status()
        return response.text
    except httpx.HTTPStatusError as exc:
        raise ScraperError(f"HTTP {exc.response.status_code} fetching {url}") from exc
    except httpx.RequestError as exc:
        raise ScraperError(f"Network error fetching {url}: {exc}") from exc


def _extract_main_content(html: str) -> str:
    """
    Parse HTML with BeautifulSoup, strip noise tags, and return
    the innermost 'main content' block as a cleaned HTML string.

    Heuristic priority:
      <main> → <article> → <div id/class containing 'content'> → <body>
    """
    try:
        soup = BeautifulSoup(html, "lxml")
    except Exception:
        soup = BeautifulSoup(html, "html.parser")

    # Remove noise
    for tag_name in _NOISE_TAGS:
        for tag in soup.find_all(tag_name):
            tag.decompose()

    # Try to find the primary content container
    content_node: Tag | None = (
        soup.find("main")
        or soup.find("article")
        or soup.find(id=lambda v: v and "content" in v.lower())  # type: ignore[arg-type]
        or soup.find(class_=lambda v: v and "content" in " ".join(v).lower())  # type: ignore[arg-type]
        or soup.find("body")
    )

    if content_node is None:
        raise ScraperError("Could not locate a main content block in the page.")

    # Return the HTML of the node, truncated to our char limit
    return str(content_node)[:_MAX_CHARS_TO_LLM]


def _build_extraction_prompt(cleaned_html: str, source_url: str) -> str:
    """
    Build the strict extraction prompt sent to Gemma.
    The prompt asks for JSON that maps 1-to-1 with SchemeSchema fields,
    including the new two-tier miscellaneous condition fields.
    """
    schema_hint = json.dumps(SchemeSchema.model_json_schema(), indent=2)

    return f"""You are a precise data-extraction assistant for Indian government schemes.
Extract ALL scheme information from the HTML below and return a SINGLE valid JSON object
that conforms EXACTLY to the following JSON Schema. Do NOT invent or guess any value —
use null for missing fields. Do NOT include any commentary, markdown fences, or extra text.

JSON Schema:
{schema_hint}

Core Rules:
- "source_url" must be exactly: "{source_url}"
- "scraped_at" must be the current UTC time in ISO 8601 format.
- "is_verified" must always be false.
- For eligibility numeric fields (min_age, max_age, max_annual_income_inr) extract
  the EXACT number stated in the text; never guess.
- For eligible_states, use 2-letter Indian state codes (e.g. "MH", "GJ").
  If the scheme is pan-India, use an empty array [].
- Return ONLY the JSON object. No markdown, no explanation.

Two-Tier Miscellaneous Condition Rules (CRITICAL — read carefully):
You MUST look for and capture any eligibility conditions or exclusions that go beyond
the standard demographic fields (age, income, gender, category, state, disability, BPL,
student, farmer). These are called "miscellaneous conditions".

Set eligibility.has_misc_conditions = true AND populate eligibility.misc_conditions
(as a list of clear, concise verification-check strings) whenever you find ANY of the
following types of conditions in the scheme text:

  1. TAX EXCLUSIONS — e.g. "Applicant or family members must not be income tax payers",
     "Beneficiary should not fall under income tax bracket".
  2. VEHICLE / ASSET OWNERSHIP LIMITS — e.g. "Family should not own a 4-wheeler",
     "Should not own more than X acres of irrigated/unirrigated land".
  3. PROPERTY / HOUSING STATUS — e.g. "Should not own a pucca house",
     "Beneficiary must not possess a house under any government housing scheme".
  4. PRIOR LOAN / BENEFIT EXCLUSIONS — e.g. "Should not have availed a similar scheme
     before", "No outstanding loan from formal financial institutions".
  5. EMPLOYMENT / OCCUPATION RESTRICTIONS — e.g. "Must not be a government employee",
     "Should not be self-employed in a formal sector".
  6. BANK ACCOUNT / CREDIT HISTORY — e.g. "Must have an active Jan Dhan account",
     "No credit default in the last 5 years".
  7. REGISTRATION / CERTIFICATION REQUIREMENTS — e.g. "Must possess a Vending Certificate",
     "Must be registered with Urban Local Body".
  8. ANY OTHER SPECIFIC INCLUSION/EXCLUSION not captured by the standard fields.

Phrase each misc_condition as a positive verification check the applicant must confirm,
e.g.:
  - "No family member is an income tax payer"
  - "Does not own more than 2.5 acres of irrigated agricultural land"
  - "Has not previously availed a loan under PM SVANidhi or similar scheme"
  - "Possesses a valid Certificate of Vending or Letter of Recommendation from ULB"

If NO such conditions exist, set has_misc_conditions = false and misc_conditions = [].

HTML to extract from:
{cleaned_html}
"""


def _parse_and_validate(raw_json: str, source_url: str) -> SchemeSchema:
    """
    Parse Gemma's raw JSON output and validate it with Pydantic.
    Raises ScraperError if parsing or validation fails.
    """
    cleaned = raw_json.strip()
    # Strip markdown code blocks like ```json ... ``` if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, re.IGNORECASE)
    if match:
        cleaned = match.group(1).strip()
    elif cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned).strip()

    try:
        data: dict[str, Any] = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ScraperError(f"Gemma returned invalid JSON: {exc}\n---\n{raw_json[:500]}") from exc

    # Always override provenance fields — never trust LLM for these
    data["source_url"] = source_url
    data["scraped_at"] = datetime.now(timezone.utc).isoformat()
    data["is_verified"] = False

    try:
        scheme = SchemeSchema.model_validate(data)
    except Exception as exc:  # Pydantic ValidationError
        raise ScraperError(f"Schema validation failed: {exc}") from exc

    return scheme


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def scrape_scheme(url: str) -> SchemeSchema:
    """
    High-level entry point.

    1. Fetch HTML
    2. Extract main content (BeautifulSoup)
    3. Send to Gemma for structured extraction (with misc_conditions prompt)
    4. Validate with Pydantic
    5. Return SchemeSchema

    Raises ScraperError on any failure.
    """
    logger.info("Scraping: %s", url)

    html = _fetch_html(url)
    cleaned_html = _extract_main_content(html)
    prompt = _build_extraction_prompt(cleaned_html, url)

    logger.debug("Sending %d chars to Gemma for extraction", len(prompt))
    try:
        raw_json = await ask_gemma(prompt)
    except Exception as exc:
        logger.error("LLM extraction failed for %s: %s", url, exc)
        raise ScraperError(f"LLM extraction failed: {exc}") from exc

    scheme = _parse_and_validate(raw_json, url)
    logger.info(
        "Successfully extracted scheme: %s (id=%s, has_misc=%s)",
        scheme.name,
        scheme.scheme_id,
        scheme.eligibility.has_misc_conditions,
    )
    return scheme


async def scrape_multiple(urls: list[str]) -> list[SchemeSchema]:
    """
    Scrape a list of URLs sequentially (to be polite to gov servers).
    Logs and skips URLs that fail validation.
    """
    results: list[SchemeSchema] = []
    for url in urls:
        try:
            scheme = await scrape_scheme(url)
            results.append(scheme)
        except ScraperError as exc:
            logger.error("Failed to scrape %s: %s", url, exc)
    return results

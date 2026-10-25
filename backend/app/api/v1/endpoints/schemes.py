"""
Schemes CRUD & AI Suggestion endpoints.
Reads directly from local store / SQLite database.
"""

from fastapi import APIRouter, HTTPException
from app.schemas.scheme import (
    SchemeSchema,
    SchemeSuggestionRequest,
    SchemeSuggestionResponse,
    SuggestedSchemeItem,
    UserProfile,
)
from app.core.store import load_all, load_by_id
from app.core.gemma_client import suggest_schemes_for_need
from app.api.v1.endpoints.eligibility import _check_scheme

router = APIRouter()


@router.post("/suggest", response_model=SchemeSuggestionResponse, summary="AI Need-Based Scheme Shortlisting")
async def suggest_schemes(req: SchemeSuggestionRequest):
    """
    Natural Language AI Need Shortlister.

    Matches a citizen's plain text need / situation against all stored schemes
    using Gemma / Gemini (or fast deterministic fallback).
    If a user profile is provided (or extracted from text hints), also evaluates
    Tier-1 / Tier-2 eligibility for each suggested scheme.
    """
    schemes = load_all()
    if not schemes:
        return SchemeSuggestionResponse(
            query=req.query,
            understood_needs=[],
            extracted_profile_hints={},
            recommendations=[],
        )

    suggest_data = await suggest_schemes_for_need(req.query, schemes)
    hints = suggest_data.get("extracted_profile_hints", {})

    # Determine evaluation profile
    eval_profile: UserProfile | None = req.user_profile
    if eval_profile is None and hints:
        eval_profile = UserProfile(
            is_farmer=hints.get("is_farmer", False),
            is_student=hints.get("is_student", False),
            gender=hints.get("gender", "any"),
            age=hints.get("age", 25),
            is_bpl=hints.get("is_bpl", False),
            is_pwd=hints.get("is_pwd", False),
            state=hints.get("state", "any"),
            annual_income_inr=hints.get("annual_income_inr", 120000.0),
        )

    scheme_map = {s.scheme_id: s for s in schemes}
    recommendations: list[SuggestedSchemeItem] = []

    for m in suggest_data.get("matches", []):
        sid = m.get("scheme_id")
        scheme = scheme_map.get(sid)
        if not scheme:
            continue

        elig_result = None
        if eval_profile:
            elig_result = _check_scheme(eval_profile, scheme)

        recommendations.append(
            SuggestedSchemeItem(
                scheme=scheme,
                relevance_score=float(m.get("relevance_score", 0.75)),
                why_recommended=str(m.get("why_recommended", "")),
                eligibility_result=elig_result,
            )
        )

    return SchemeSuggestionResponse(
        query=req.query,
        understood_needs=suggest_data.get("understood_needs", []),
        extracted_profile_hints=hints,
        recommendations=recommendations,
    )


@router.get("/", response_model=list[SchemeSchema], summary="List all stored schemes")
async def list_schemes():
    """Return all validated schemes from backend/data/schemes.json."""
    return load_all()


@router.get("/{scheme_id}", response_model=SchemeSchema, summary="Get a scheme by ID")
async def get_scheme(scheme_id: str):
    """Retrieve a single scheme by its scheme_id."""
    scheme = load_by_id(scheme_id)
    if scheme is None:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found")
    return scheme

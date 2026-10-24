"""
Eligibility check endpoint — deterministic rule engine.
The rule engine NEVER calls an LLM for numeric/categorical comparisons.

Two-Bucket Architecture
------------------------
Bucket 1 (eligible=True):
  All standard criteria pass. If the scheme also has has_misc_conditions=True,
  requires_misc_check=True is set and misc_conditions_to_verify is populated
  so the frontend can prompt the user to self-verify those extra conditions.

Bucket 2 (eligible=False, 1–2 criteria fail):
  Near-misses are included with failed_criteria populated so Gemma can
  explain exactly what is missing ("Why Not" engine).
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.schemas.scheme import EligibilityResult
from app.core.store import load_all

router = APIRouter()


# ---------------------------------------------------------------------------
# Request model — user profile
# ---------------------------------------------------------------------------

class UserProfile(BaseModel):
    age: int
    annual_income_inr: float
    gender: str                             # "male" | "female" | "transgender" | "any"
    state: str                              # 2-letter code e.g. "MH"
    category: str                           # "general" | "obc" | "sc" | "st" | "ews"
    marital_status: str                     # "single" | "married" | "widowed" | "divorced" | "any"
    is_pwd: bool = False
    is_bpl: bool = False
    is_student: bool = False
    is_farmer: bool = False
    needs_description: Optional[str] = None  # Free text for RAG search (Stage 3)


# ---------------------------------------------------------------------------
# Deterministic rule engine helpers
# ---------------------------------------------------------------------------

def _check_scheme(profile: UserProfile, scheme) -> EligibilityResult:
    """
    Compare a single SchemeSchema against *profile* using pure Python comparisons.
    Returns an EligibilityResult with bucket assignment and failed_criteria.
    """
    e = scheme.eligibility
    failed: list[str] = []
    total_criteria = 0

    # --- Age ---
    if e.min_age is not None:
        total_criteria += 1
        if profile.age < e.min_age:
            failed.append(f"Age {profile.age} is below minimum {e.min_age}")

    if e.max_age is not None:
        total_criteria += 1
        if profile.age > e.max_age:
            failed.append(f"Age {profile.age} exceeds maximum {e.max_age}")

    # --- Income ---
    if e.max_annual_income_inr is not None:
        total_criteria += 1
        if profile.annual_income_inr > e.max_annual_income_inr:
            failed.append(
                f"Annual income ₹{profile.annual_income_inr:,.0f} exceeds "
                f"maximum ₹{e.max_annual_income_inr:,.0f}"
            )

    # --- Gender ---
    if e.gender not in ("any",):
        total_criteria += 1
        if profile.gender.lower() != e.gender.lower():
            failed.append(f"Gender must be '{e.gender}' (you: '{profile.gender}')")

    # --- Category ---
    cats = [c.value if hasattr(c, "value") else c for c in e.category]
    if cats and "any" not in cats:
        total_criteria += 1
        if profile.category.lower() not in [c.lower() for c in cats]:
            failed.append(f"Category '{profile.category}' not in {cats}")

    # --- Marital status ---
    if e.marital_status not in ("any",):
        total_criteria += 1
        if profile.marital_status.lower() != e.marital_status.lower():
            failed.append(
                f"Marital status must be '{e.marital_status}' (you: '{profile.marital_status}')"
            )

    # --- Geography ---
    if e.eligible_states:
        total_criteria += 1
        state_map = {
            "ANDHRA PRADESH": "AP", "ARUNACHAL PRADESH": "AR", "ASSAM": "AS", "BIHAR": "BR",
            "CHHATTISGARH": "CG", "GOA": "GA", "GUJARAT": "GJ", "HARYANA": "HR",
            "HIMACHAL PRADESH": "HP", "JHARKHAND": "JH", "KARNATAKA": "KA", "KERALA": "KL",
            "MADHYA PRADESH": "MP", "MAHARASHTRA": "MH", "MANIPUR": "MN", "MEGHALAYA": "ML",
            "MIZORAM": "MZ", "NAGALAND": "NL", "ODISHA": "OD", "PUNJAB": "PB",
            "RAJASTHAN": "RJ", "SIKKIM": "SK", "TAMIL NADU": "TN", "TELANGANA": "TG",
            "TRIPURA": "TR", "UTTAR PRADESH": "UP", "UTTARAKHAND": "UK", "WEST BENGAL": "WB",
            "DELHI (NCT)": "DL", "DELHI": "DL", "JAMMU & KASHMIR": "JK", "JAMMU AND KASHMIR": "JK"
        }
        # Inverted map: code -> name
        code_map = {v: k for k, v in state_map.items()}
        
        user_state_clean = profile.state.strip().upper()
        user_state_code = state_map.get(user_state_clean, user_state_clean)

        allowed_codes = set()
        for s in e.eligible_states:
            s_clean = s.strip().upper()
            allowed_codes.add(s_clean)
            if s_clean in state_map:
                allowed_codes.add(state_map[s_clean])
            if s_clean in code_map:
                allowed_codes.add(code_map[s_clean])

        if user_state_clean not in allowed_codes and user_state_code not in allowed_codes:
            failed.append(
                f"State '{profile.state}' not in eligible states {e.eligible_states}"
            )

    # --- Special flags ---
    if e.is_pwd_required:
        total_criteria += 1
        if not profile.is_pwd:
            failed.append("Scheme is exclusively for Persons with Disability")

    if e.is_bpl_required:
        total_criteria += 1
        if not profile.is_bpl:
            failed.append("Scheme requires a valid BPL card")

    if e.is_student_required:
        total_criteria += 1
        if not profile.is_student:
            failed.append("Scheme requires applicant to be an enrolled student")

    if e.is_farmer_required:
        total_criteria += 1
        if not profile.is_farmer:
            failed.append("Scheme requires applicant to be a farmer")

    # --- Scoring ---
    checked = max(total_criteria, 1)
    match_score = round(1.0 - len(failed) / checked, 4)
    is_eligible = len(failed) == 0

    # --- Two-tier misc check (Bucket 1 only) ---
    requires_misc_check = is_eligible and e.has_misc_conditions
    misc_conditions_to_verify = list(e.misc_conditions) if requires_misc_check else []

    why_not_explanation = (
        f"You did not qualify due to the following missing requirement(s): {'; '.join(failed)}."
        if not is_eligible and failed
        else None
    )

    return EligibilityResult(
        scheme_id=scheme.scheme_id,
        scheme_name=scheme.name,
        is_eligible=is_eligible,
        match_score=match_score,
        failed_criteria=failed,
        requires_misc_check=requires_misc_check,
        misc_conditions_to_verify=misc_conditions_to_verify,
        why_not_explanation=why_not_explanation,
    )


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("/check", response_model=list[EligibilityResult], summary="Check scheme eligibility")
async def check_eligibility(profile: UserProfile):
    """
    Deterministic eligibility engine.

    Compares user profile against all stored SchemeSchema records (loaded from
    backend/data/schemes.json) using pure Python comparisons — no LLM involved.

    Returns:
    - Bucket 1: schemes where all standard criteria pass.
      If requires_misc_check=True the user must self-verify misc_conditions_to_verify.
    - Bucket 2: near-miss schemes (1–2 criteria fail) with failed_criteria populated
      for the 'Why Not' Gemma explainability layer.
    """
    schemes = load_all()
    results: list[EligibilityResult] = []

    for scheme in schemes:
        result = _check_scheme(profile, scheme)
        # Include fully eligible (Bucket 1) AND near-misses with ≤ 2 failed criteria (Bucket 2)
        if result.is_eligible or len(result.failed_criteria) <= 2:
            results.append(result)

    # Sort: eligible first, then by match_score descending
    results.sort(key=lambda r: (not r.is_eligible, -r.match_score))
    return results

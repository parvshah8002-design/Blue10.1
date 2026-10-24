"""
Pydantic SchemeSchema — Stage 1
================================
Strict data contract for every government scheme stored in the system.
All numeric/categorical eligibility fields are typed precisely so the
deterministic rule engine can compare them without touching an LLM.
"""

from __future__ import annotations

from enum import Enum
from typing import Literal, Optional
from pydantic import BaseModel, Field, field_validator, HttpUrl
import uuid


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class Gender(str, Enum):
    male = "male"
    female = "female"
    transgender = "transgender"
    any = "any"


class MaritalStatus(str, Enum):
    single = "single"
    married = "married"
    widowed = "widowed"
    divorced = "divorced"
    any = "any"


class Category(str, Enum):
    general = "general"
    obc = "obc"
    sc = "sc"
    st = "st"
    ews = "ews"
    any = "any"


class SchemeType(str, Enum):
    central = "central"       # Central government scheme
    state = "state"           # State government scheme
    psu = "psu"               # Public sector undertaking


# ---------------------------------------------------------------------------
# Eligibility block — deterministic fields ONLY
# ---------------------------------------------------------------------------

class EligibilityCriteria(BaseModel):
    """
    All fields that the rule engine compares deterministically.
    'None' means the scheme imposes NO restriction for that field.
    """

    # Age
    min_age: Optional[int] = Field(None, ge=0, le=150, description="Minimum age in years (inclusive)")
    max_age: Optional[int] = Field(None, ge=0, le=150, description="Maximum age in years (inclusive)")

    # Income
    max_annual_income_inr: Optional[float] = Field(None, ge=0, description="Max household income per annum (INR)")

    # Demographics
    gender: Gender = Field(Gender.any, description="Required gender of applicant")
    marital_status: MaritalStatus = Field(MaritalStatus.any, description="Required marital status")
    category: list[Category] = Field(default_factory=lambda: [Category.any], description="Eligible caste/category list")

    # Geography
    eligible_states: list[str] = Field(
        default_factory=list,
        description="ISO state codes e.g. ['MH','GJ']. Empty list = all India.",
    )

    # Special flags
    is_pwd_required: bool = Field(False, description="True if scheme is exclusively for persons with disability")
    is_bpl_required: bool = Field(False, description="True if Below Poverty Line card is mandatory")
    is_student_required: bool = Field(False, description="True if applicant must be an enrolled student")
    is_farmer_required: bool = Field(False, description="True if applicant must be a farmer")

    # -----------------------------------------------------------------------
    # Two-Tier Miscellaneous Condition flags
    # -----------------------------------------------------------------------
    has_misc_conditions: bool = Field(
        False,
        description=(
            "True if the scheme has additional specific eligibility conditions or exclusions "
            "beyond the standard demographic fields — e.g. income-tax payer exclusions, "
            "vehicle ownership limits, land size caps, prior-loan exclusions."
        ),
    )
    misc_conditions: list[str] = Field(
        default_factory=list,
        description=(
            "List of specific miscellaneous conditions or exclusions phrased as clear "
            "verification checks the applicant must confirm, e.g., "
            "'No family member is an income tax payer', "
            "'Does not own more than 2.5 acres of irrigated land', "
            "'Has not availed a similar loan in the last 3 years'."
        ),
    )

    @field_validator("max_age")
    @classmethod
    def max_age_gte_min_age(cls, v: Optional[int], info) -> Optional[int]:
        min_age = info.data.get("min_age")
        if v is not None and min_age is not None and v < min_age:
            raise ValueError(f"max_age ({v}) must be >= min_age ({min_age})")
        return v


# ---------------------------------------------------------------------------
# Benefit block
# ---------------------------------------------------------------------------

class Benefit(BaseModel):
    benefit_type: Literal["financial", "in_kind", "service", "scholarship", "other"]
    description: str = Field(..., min_length=1)
    amount_inr: Optional[float] = Field(None, ge=0, description="One-time or per-period monetary value if applicable")
    frequency: Optional[Literal["one_time", "monthly", "quarterly", "annual"]] = None


# ---------------------------------------------------------------------------
# Main SchemeSchema
# ---------------------------------------------------------------------------

class SchemeSchema(BaseModel):
    """
    Master schema for a single government scheme.
    All scraped schemes MUST validate against this before being persisted.
    """

    # Identity
    scheme_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=3, description="Official scheme name")
    short_name: Optional[str] = Field(None, description="Acronym or short form e.g. 'PM-KISAN'")
    description: str = Field(..., min_length=10, description="Plain-language description of what the scheme offers")

    # Classification
    scheme_type: SchemeType
    ministry: Optional[str] = Field(None, description="Administering ministry or department")
    tags: list[str] = Field(default_factory=list, description="Free-form tags for semantic search e.g. ['education','women']")

    # Eligibility (deterministic rule engine input)
    eligibility: EligibilityCriteria

    # Benefits
    benefits: list[Benefit] = Field(..., min_length=1)

    # Application
    application_url: Optional[HttpUrl] = Field(None, description="Direct link to apply")
    documents_required: list[str] = Field(default_factory=list)
    application_deadline: Optional[str] = Field(None, description="ISO date string or 'Ongoing'")

    # Provenance
    source_url: HttpUrl = Field(..., description="URL where this scheme was scraped from")
    scraped_at: Optional[str] = Field(None, description="ISO 8601 timestamp of last scrape")
    is_verified: bool = Field(False, description="Set True after human/LLM cross-verification")

    class Config:
        # Allow population by field name AND alias
        populate_by_name = True
        # Serialize enums as their values
        use_enum_values = True


# ---------------------------------------------------------------------------
# Eligibility check response model
# ---------------------------------------------------------------------------

class EligibilityResult(BaseModel):
    """
    Result of the deterministic eligibility rule engine for one scheme.

    Bucket 1 (is_eligible=True):
      - All standard criteria matched.
      - If requires_misc_check=True the user must additionally confirm
        all items in misc_conditions_to_verify before applying.

    Bucket 2 (is_eligible=False):
      - failed_criteria lists which standard fields didn't match.
      - The 'Why Not' engine uses this list to explain the gap.
    """

    scheme_id: str
    scheme_name: str
    is_eligible: bool
    match_score: float                    # 0.0 – 1.0
    failed_criteria: list[str]            # empty if fully eligible on standard fields

    # Miscellaneous / two-tier check fields
    requires_misc_check: bool = Field(
        False,
        description=(
            "True when the scheme is in Bucket 1 (standard criteria all pass) "
            "but has additional miscellaneous conditions the user must self-verify."
        ),
    )
    misc_conditions_to_verify: list[str] = Field(
        default_factory=list,
        description=(
            "Copied from SchemeSchema.eligibility.misc_conditions when "
            "requires_misc_check=True. Empty for Bucket 2 results."
        ),
    )
    why_not_explanation: Optional[str] = Field(
        None,
        description="Plain-language explanation of missing criteria when not eligible",
    )

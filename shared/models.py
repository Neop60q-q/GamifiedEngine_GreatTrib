from typing import Literal, Optional

from pydantic import BaseModel, Field


class XPFactors(BaseModel):
    difficulty: Literal[
        "VERY_EASY",
        "EASY",
        "MODERATE",
        "DIFFICULT",
        "EXPERT"
    ]

    estimated_time_value: float = Field(gt=0)

    estimated_time_unit: Literal[
        "MINUTES",
        "HOURS",
        "DAYS",
        "WEEKS",
        "MONTHS"
    ]

    skill_level: Literal[
        "NONE",
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
        "PROFESSIONAL"
    ]

    effort: Literal[
        "MINIMAL",
        "LOW",
        "MODERATE",
        "HIGH",
        "INTENSIVE"
    ]

    complexity: Literal[
        "SINGLE_STEP",
        "TWO_STEP",
        "MULTIPLE_STEPS",
        "MULTI_STAGE",
        "ONGOING"
    ]

    student_impact: Literal[
        "LOW",
        "MODERATE",
        "HIGH",
        "SIGNIFICANT",
        "TRANSFORMATIONAL"
    ]

    verification_method: Literal[
        "AUTOMATIC",
        "SELF_DECLARATION",
        "EDUCATOR_APPROVAL",
        "EMPLOYER_APPROVAL",
        "MANUAL_REVIEW"
    ]

    repeatability: Literal[
        "ONE_TIME",
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "UNLIMITED"
    ]

    completion_type: Literal[
        "COMPLETION",
        "PASS_FAIL",
        "SCORE_BASED",
        "ATTENDANCE",
        "SUBMISSION",
        "EMPLOYER_ACCEPTED"
    ]


class ActivityCreate(BaseModel):
    creator_external_id: str
    creator_role: Literal["EMPLOYER", "EDUCATOR"]

    # In the real integration Laravel maps Alumable's ID into this field.
    external_id: str

    title: str
    description: str
    category: str

    factors: XPFactors

    start_date: Optional[str] = None
    end_date: Optional[str] = None

    status: Literal["Draft", "Active", "Inactive"] = "Draft"


class ActivityMVPCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    category: str = Field(min_length=1, max_length=50)


class CompletionEvent(BaseModel):
    event_id: str
    external_user_id: str
    external_activity_id: str
    approval_status: str = "APPROVED"


class ActivityRecalculateRequest(BaseModel):
    new_final_xp: int = Field(ge=0)


class AvatarEquipRequest(BaseModel):
    external_user_id: str
    item_code: str

import json
from uuid import uuid4
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import (
    Activity,
    ActivityVersion,
    ActivitySkillAllocation,
    Skill,
    CosmeticItem,
    CosmeticRewardRule,
)
from repositories.activity_repository import ActivityRepository
from services.xp_calculator import XPCalculator
from shared.config import settings
from shared.models import ActivityMVPCreate, ActivityPrototypeCreate, XPFactors

app = FastAPI(title="Alumable Creation Engine v6", version="0.7.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
activities = ActivityRepository()
calculator = XPCalculator()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "creation-engine",
        "environment": settings.ENVIRONMENT,
    }


def activity_response(activity, db):
    allocations = (
        db.query(ActivitySkillAllocation, Skill)
        .join(Skill, Skill.id == ActivitySkillAllocation.skill_id)
        .filter(ActivitySkillAllocation.activity_id == activity.id)
        .all()
    )
    return {
        "id": activity.id,
        "external_id": activity.external_id,
        "creator_external_id": activity.creator_external_id,
        "creator_role": activity.creator_role,
        "title": activity.title,
        "description": activity.description,
        "category": activity.category,
        "final_xp": activity.final_xp,
        "minimum_level": activity.minimum_level,
        "repeatability": activity.repeatability or "ONE_TIME",
        "status": activity.status,
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "skill_allocations": [
            {
                "skill_code": sk.code,
                "skill_name": sk.name,
                "percentage": a.percentage,
                "calculated_skill_xp": round(activity.final_xp * a.percentage / 100),
            }
            for a, sk in allocations
        ],
    }


def persist(payload, db):
    final_xp, rule_version = calculator.calculate(db, payload.factors)
    if sum(x.percentage for x in payload.skill_allocations) > 100:
        raise HTTPException(
            422, "Skill allocation percentages cannot exceed 100%")
    activity = Activity(
        external_id=f"demo-activity-{uuid4().hex}",
        source_system=settings.SOURCE_SYSTEM,
        creator_external_id=payload.creator_external_id,
        creator_role=payload.creator_role,
        title=payload.title.strip(),
        description=payload.description.strip(),
        category=payload.category.strip(),
        difficulty=payload.factors.difficulty,
        estimated_time_value=payload.factors.estimated_time_value,
        estimated_time_unit=payload.factors.estimated_time_unit,
        skill_level=payload.factors.skill_level,
        effort=payload.factors.effort,
        complexity=payload.factors.complexity,
        student_impact=payload.factors.student_impact,
        verification_method=payload.factors.verification_method,
        repeatability=payload.factors.repeatability,
        completion_type=payload.factors.completion_type,
        minimum_level=payload.minimum_level,
        final_xp=final_xp,
        xp_rule_version=rule_version,
        version=1,
        status=payload.status,
    )
    try:
        db.add(activity)
        db.flush()
        for alloc in payload.skill_allocations:
            skill = (
                db.query(Skill)
                .filter(Skill.code == alloc.skill_code, Skill.status == "Active")
                .first()
            )
            if not skill:
                raise HTTPException(422, f"Unknown skill: {alloc.skill_code}")
            db.add(
                ActivitySkillAllocation(
                    activity_id=activity.id,
                    skill_id=skill.id,
                    percentage=alloc.percentage,
                )
            )
        if payload.cosmetic_reward_code:
            item = (
                db.query(CosmeticItem)
                .filter(CosmeticItem.code == payload.cosmetic_reward_code)
                .first()
            )
            if not item:
                raise HTTPException(422, "Unknown cosmetic reward")
            db.add(
                CosmeticRewardRule(
                    item_id=item.id,
                    source_type="ACTIVITY",
                    source_code=activity.external_id,
                    active=True,
                )
            )
        db.add(
            ActivityVersion(
                activity_id=activity.id,
                version=1,
                final_xp=final_xp,
                xp_rule_version=rule_version,
                snapshot_json=json.dumps(payload.model_dump()),
            )
        )
        db.commit()
        db.refresh(activity)
    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(500, "Could not save activity") from exc
    return activity_response(activity, db)


@app.post("/v1/activities/preview-xp")
def preview_activity_xp(payload: XPFactors, db: Session = Depends(get_db)):
    """Calculate XP from the current form factors without creating an activity."""
    final_xp, rule_version = calculator.calculate(db, payload)
    return {"calculated_xp": final_xp, "xp_rule_version": rule_version}


@app.post("/v1/activities/prototype")
def create_prototype_activity(
    payload: ActivityPrototypeCreate, db: Session = Depends(get_db)
):
    return persist(payload, db)


@app.post("/v1/activities")
def create_activity(payload: ActivityMVPCreate, db: Session = Depends(get_db)):
    from shared.models import XPFactors, ActivityPrototypeCreate

    expanded = ActivityPrototypeCreate(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        status="Draft",
        factors=XPFactors(
            difficulty="EASY",
            estimated_time_value=30,
            estimated_time_unit="MINUTES",
            skill_level="BEGINNER",
            effort="LOW",
            complexity="SINGLE_STEP",
            student_impact="LOW",
            verification_method="SELF_DECLARATION",
            repeatability="ONE_TIME",
            completion_type="COMPLETION",
        ),
    )
    return persist(expanded, db)


@app.get("/v1/activities")
def list_activities(db: Session = Depends(get_db)):
    return [activity_response(a, db) for a in activities.list(db)]


@app.get("/v1/activities/active")
def list_active_activities(db: Session = Depends(get_db)):
    return [
        activity_response(a, db)
        for a in db.query(Activity)
        .filter(Activity.status == "Active")
        .order_by(Activity.created_at.desc())
        .all()
    ]


@app.get("/v1/activities/{external_id}")
def get_activity(external_id: str, db: Session = Depends(get_db)):
    a = activities.get_by_external_id(db, external_id)
    if a is None:
        raise HTTPException(404, "Activity not found")
    return activity_response(a, db)

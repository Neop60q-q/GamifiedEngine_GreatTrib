import json

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Activity, ActivityVersion
from repositories.activity_repository import ActivityRepository
from services.xp_calculator import XPCalculator
from shared.config import settings
from shared.models import ActivityCreate


app = FastAPI(
    title="Alumable Creation Engine v6",
    version="0.6.0"
)

activities = ActivityRepository()
calculator = XPCalculator()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "creation-engine",
        "environment": settings.ENVIRONMENT
    }


@app.post("/v1/activities")
def create_activity(
    payload: ActivityCreate,
    db: Session = Depends(get_db)
):
    if payload.creator_role not in {
        "EMPLOYER",
        "EDUCATOR"
    }:
        raise HTTPException(
            403,
            "Only Employers and Educators may create Activities"
        )

    existing = activities.get_by_external_id(
        db,
        payload.external_id
    )

    if existing:
        raise HTTPException(
            409,
            "Activity external_id already exists"
        )

    final_xp, rule_version = calculator.calculate(
        db,
        payload.factors
    )

    activity = Activity(
        external_id=payload.external_id,
        source_system=settings.SOURCE_SYSTEM,
        creator_external_id=payload.creator_external_id,
        creator_role=payload.creator_role,
        title=payload.title,
        description=payload.description,
        category=payload.category,
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
        final_xp=final_xp,
        xp_rule_version=rule_version,
        version=1,
        status=payload.status
    )

    activities.save(db, activity)

    snapshot = payload.model_dump()
    snapshot["final_xp"] = final_xp

    activities.save_version(
        db,
        ActivityVersion(
            activity_id=activity.id,
            version=1,
            final_xp=final_xp,
            xp_rule_version=rule_version,
            snapshot_json=json.dumps(snapshot)
        )
    )

    return {
        "id": activity.id,
        "external_id": activity.external_id,
        "title": activity.title,
        "final_xp": activity.final_xp,
        "xp_rule_version": activity.xp_rule_version,
        "version": activity.version,
        "status": activity.status,
    }


@app.get("/v1/activities/{external_id}")
def get_activity(
    external_id: str,
    db: Session = Depends(get_db)
):
    activity = activities.get_by_external_id(
        db,
        external_id
    )

    if activity is None:
        raise HTTPException(404, "Activity not found")

    return {
        "id": activity.id,
        "external_id": activity.external_id,
        "title": activity.title,
        "final_xp": activity.final_xp,
        "version": activity.version,
        "status": activity.status,
    }

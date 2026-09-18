import json

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Activity, ActivityVersion, ActivitySkillAllocation, Skill
from repositories.activity_repository import ActivityRepository
from services.xp_calculator import XPCalculator
from shared.config import settings
from shared.models import ActivityCreate, SkillCreate

from repositories.skill_repository import SkillRepository


app = FastAPI(
    title="Alumable Creation Engine v6",
    version="0.6.0"
)

activities = ActivityRepository()
calculator = XPCalculator()
skills = SkillRepository()


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
    # Prototype skill system validation. These are not fully fleshed out yet, but will be used to prototype the skill system.
    if sum(a.percentage for a in payload.skill_allocations) > 100.0001:
        raise HTTPException(400, "Skill allocation percentages cannot total more than 100")

    resolved_skills = []
    seen_codes = set()
    for allocation in payload.skill_allocations:
        if allocation.skill_code in seen_codes:
            raise HTTPException(400, f"Duplicate skill allocation: {allocation.skill_code}")
        seen_codes.add(allocation.skill_code)
        skill = skills.get_by_code(db, allocation.skill_code)
        if skill is None or skill.status != "Active":
            raise HTTPException(400, f"Unknown or inactive skill: {allocation.skill_code}")
        resolved_skills.append((skill, allocation.percentage))

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

    # Prototype skill system allocation. These are not fully fleshed out yet, but will be used to prototype the skill system.
    skills.replace_activity_allocations(
        db, activity.id,
        [ActivitySkillAllocation(activity_id=activity.id, skill_id=skill.id, percentage=percentage)
         for skill, percentage in resolved_skills]
    )

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
        "skill_allocations": [
            {"skill_code": skill.code, "skill_name": skill.name, "percentage": percentage,
             "calculated_skill_xp": round(activity.final_xp * percentage / 100)}
            for skill, percentage in resolved_skills
        ],
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


# Prototype skill system endpoints. These are not fully fleshed out yet, but will be used to prototype the skill system.
@app.get("/v1/skills")
def list_skills(db: Session = Depends(get_db)):
    return [{"external_id": s.external_id, "code": s.code, "name": s.name,
             "description": s.description, "category": s.category, "status": s.status}
            for s in skills.list_active(db)]


@app.post("/v1/skills")
def create_skill(payload: SkillCreate, db: Session = Depends(get_db)):
    if skills.get_by_code(db, payload.code) or skills.get_by_external_id(db, payload.external_id):
        raise HTTPException(409, "Skill code or external_id already exists")
    parent_id = None
    if payload.parent_skill_code:
        parent = skills.get_by_code(db, payload.parent_skill_code)
        if parent is None:
            raise HTTPException(400, "Parent skill not found")
        parent_id = parent.id
    skill = skills.save(db, Skill(external_id=payload.external_id, code=payload.code, name=payload.name,
        description=payload.description, category=payload.category, parent_skill_id=parent_id, status=payload.status))
    return {"external_id": skill.external_id, "code": skill.code, "name": skill.name,
            "category": skill.category, "status": skill.status}

import json
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Activity, ActivityVersion
from repositories.activity_repository import ActivityRepository
from shared.config import settings
from shared.models import ActivityMVPCreate


app = FastAPI(
    title="Alumable Creation Engine v6",
    version="0.6.0"
)

activities = ActivityRepository()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "creation-engine",
        "environment": settings.ENVIRONMENT
    }


def activity_response(activity: Activity):
    return {
        "id": activity.id,
        "external_id": activity.external_id,
        "creator_external_id": activity.creator_external_id,
        "creator_role": activity.creator_role,
        "title": activity.title,
        "description": activity.description,
        "category": activity.category,
        "final_xp": activity.final_xp,
        "status": activity.status,
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
    }


@app.post("/v1/activities")
def create_activity(
    payload: ActivityMVPCreate,
    db: Session = Depends(get_db)
):
    activity = Activity(
        external_id=f"demo-activity-{uuid4().hex}",
        source_system=settings.SOURCE_SYSTEM,
        creator_external_id="demo-creator",
        creator_role="EDUCATOR",
        title=payload.title.strip(),
        description=payload.description.strip(),
        category=payload.category.strip(),
        final_xp=0,
        xp_rule_version=0,
        version=1,
        status="Draft",
    )

    if not activity.title or not activity.description or not activity.category:
        raise HTTPException(422, "Title, description, and category are required")

    try:
        db.add(activity)
        db.flush()
        db.add(
            ActivityVersion(
                activity_id=activity.id,
                version=1,
                final_xp=0,
                xp_rule_version=0,
                snapshot_json=json.dumps(payload.model_dump()),
            )
        )
        db.commit()
        db.refresh(activity)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(500, "Could not save activity") from exc

    return activity_response(activity)


@app.get("/v1/activities")
def list_activities(db: Session = Depends(get_db)):
    return [activity_response(activity) for activity in activities.list(db)]


@app.get("/v1/activities/{external_id}")
def get_activity(
    external_id: str,
    db: Session = Depends(get_db)
):
    activity = activities.get_by_external_id(db, external_id)

    if activity is None:
        raise HTTPException(404, "Activity not found")

    return activity_response(activity)

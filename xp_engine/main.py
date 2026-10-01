import json

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import (
    ActivityCompletion,
    ActivityVersion,
    ActivitySkillAllocation,
    Skill,
    SkillXPTransaction,
)
from repositories.activity_repository import ActivityRepository
from repositories.completion_repository import CompletionRepository
from services.achievement_service import AchievementService
from services.avatar_reward_service import AvatarRewardService
from services.progression_service import ProgressionService
from services.recalculation_service import RecalculationService
from services.xp_award_service import XPAwardService
from shared.models import ActivityRecalculateRequest, CompletionEvent

app = FastAPI(title="Alumable XP Engine v6", version="0.6.0")

activities = ActivityRepository()
completions = CompletionRepository()
awards = XPAwardService()
progression = ProgressionService()
achievements = AchievementService()
avatar_rewards = AvatarRewardService()
recalculation = RecalculationService()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "xp-engine"}


@app.post("/v1/completions/activity")
def complete_activity(event: CompletionEvent, db: Session = Depends(get_db)):
    activity = activities.get_by_external_id(db, event.external_activity_id)

    if activity is None or activity.status != "Active":
        raise HTTPException(404, "Activity unavailable")

    existing_completion = completions.find_by_event(db, event.event_id)

    if existing_completion:
        total = awards.total(db, event.external_user_id)

        current = progression.update(db, event.external_user_id, total)

        return {
            "status": "duplicate",
            "activity_xp": 0,
            "total_xp": total,
            **current,
        }

    if event.approval_status != "APPROVED":
        return {"status": "awaiting_verification"}

    completion = ActivityCompletion(
        external_user_id=event.external_user_id,
        activity_id=activity.id,
        activity_version=activity.version,
        xp_value_at_completion=activity.final_xp,
        completion_event_id=event.event_id,
        verification_status=event.approval_status,
    )

    completions.save(db, completion)

    skill_awards = []
    allocations = (
        db.query(ActivitySkillAllocation, Skill)
        .join(Skill, Skill.id == ActivitySkillAllocation.skill_id)
        .filter(ActivitySkillAllocation.activity_id == activity.id)
        .all()
    )
    for allocation, skill in allocations:
        amount = round(activity.final_xp * allocation.percentage / 100)
        key = f"skill-activity:{event.event_id}:{skill.id}"
        if (
            not db.query(SkillXPTransaction)
            .filter(SkillXPTransaction.idempotency_key == key)
            .first()
        ):
            db.add(
                SkillXPTransaction(
                    external_user_id=event.external_user_id,
                    skill_id=skill.id,
                    amount=amount,
                    source_completion_id=completion.id,
                    idempotency_key=key,
                )
            )
            db.commit()
        skill_awards.append(
            {"skill_code": skill.code, "skill_name": skill.name, "xp_awarded": amount}
        )

    _, activity_awarded = awards.award(
        db,
        event.external_user_id,
        activity.final_xp,
        "ACTIVITY",
        activity.id,
        f"activity:{event.event_id}",
        source_completion_id=completion.id,
    )

    total = awards.total(db, event.external_user_id)

    # Achievement rules are evaluated after task XP.
    newly_earned = achievements.evaluate(db, event.external_user_id, total)

    achievement_bonus_xp = 0
    achievement_results = []
    cosmetic_results = []

    for earned in newly_earned:
        achievement = earned["achievement"]
        record = earned["student_achievement"]

        if achievement.bonus_xp:
            _, created = awards.award(
                db,
                event.external_user_id,
                achievement.bonus_xp,
                "ACHIEVEMENT",
                achievement.id,
                (f"achievement:" f"{achievement.id}:" f"user:{event.external_user_id}"),
                source_completion_id=record.id,
            )

            if created:
                achievement_bonus_xp += achievement.bonus_xp

        achievement_results.append(
            {
                "code": achievement.code,
                "name": achievement.name,
                "bonus_xp": achievement.bonus_xp,
            }
        )

        cosmetic_results.extend(
            avatar_rewards.grant_for_source(
                db,
                event.external_user_id,
                "ACHIEVEMENT",
                achievement.code,
                (
                    f"achievement:"
                    f"{achievement.code}:"
                    f"user:{event.external_user_id}"
                ),
            )
        )

    # Activity cosmetic rewards are data-driven too.
    cosmetic_results.extend(
        avatar_rewards.grant_for_source(
            db,
            event.external_user_id,
            "ACTIVITY",
            activity.external_id,
            f"activity:{event.event_id}",
        )
    )

    total = awards.total(db, event.external_user_id)

    level_result = progression.update(db, event.external_user_id, total)

    if level_result["level_up"]:
        cosmetic_results.extend(
            avatar_rewards.grant_for_source(
                db,
                event.external_user_id,
                "LEVEL",
                f"LEVEL_{level_result['current_level']}",
                (
                    f"level:"
                    f"{level_result['current_level']}:"
                    f"user:{event.external_user_id}"
                ),
            )
        )

    return {
        "status": "completed",
        "activity_xp": (activity.final_xp if activity_awarded else 0),
        "achievement_bonus_xp": achievement_bonus_xp,
        "total_xp": total,
        "achievements_unlocked": achievement_results,
        "cosmetics_unlocked": cosmetic_results,
        "skill_xp_awarded": skill_awards,
        **level_result,
    }


@app.get("/v1/students/{external_user_id}/progress")
def get_progress(external_user_id: str, db: Session = Depends(get_db)):
    total = awards.total(db, external_user_id)

    result = progression.update(db, external_user_id, total)

    skill_rows = (
        db.query(Skill, SkillXPTransaction)
        .join(SkillXPTransaction, SkillXPTransaction.skill_id == Skill.id)
        .filter(SkillXPTransaction.external_user_id == external_user_id)
        .all()
    )
    totals = {}
    for skill, transaction in skill_rows:
        entry = totals.setdefault(
            skill.code,
            {"skill_code": skill.code, "skill_name": skill.name, "total_xp": 0},
        )
        entry["total_xp"] += transaction.amount
    return {
        "external_user_id": external_user_id,
        "total_xp": total,
        "skills": list(totals.values()),
        **result,
    }


@app.post("/v1/recalculate/activity/{external_activity_id}")
def recalculate_activity(
    external_activity_id: str,
    payload: ActivityRecalculateRequest,
    db: Session = Depends(get_db),
):
    activity = activities.get_by_external_id(db, external_activity_id)

    if activity is None:
        raise HTTPException(404, "Activity not found")

    old_xp = activity.final_xp
    old_version = activity.version

    affected = recalculation.recalculate_activity(db, activity, payload.new_final_xp)

    activity.final_xp = payload.new_final_xp
    activity.version += 1
    activities.save(db, activity)

    activities.save_version(
        db,
        ActivityVersion(
            activity_id=activity.id,
            version=activity.version,
            final_xp=activity.final_xp,
            xp_rule_version=activity.xp_rule_version,
            snapshot_json=json.dumps(
                {
                    "recalculated_from_version": old_version,
                    "old_final_xp": old_xp,
                    "new_final_xp": activity.final_xp,
                }
            ),
        ),
    )

    return {
        "external_activity_id": external_activity_id,
        "old_final_xp": old_xp,
        "new_final_xp": activity.final_xp,
        "new_version": activity.version,
        "students_adjusted": len(affected),
        "affected": affected,
    }

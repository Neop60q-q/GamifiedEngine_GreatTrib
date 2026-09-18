from repositories.completion_repository import CompletionRepository
from services.xp_award_service import XPAwardService
from services.progression_service import ProgressionService

from database.models import Skill, SkillXPTransaction
from repositories.skill_xp_repository import SkillXPRepository
from services.skill_progression_service import SkillProgressionService



class RecalculationService:
    """
    Retroactive XP updates are represented as ADJUSTMENT transactions.

    Original transactions are never deleted, preserving a full audit trail.
    """

    def __init__(self):
        self.completions = CompletionRepository()
        self.awards = XPAwardService()
        self.progression = ProgressionService()
        self.skill_xp = SkillXPRepository()
        self.skill_progression = SkillProgressionService()

    def recalculate_activity(self, db, activity, new_final_xp: int):
        affected = []

        for completion in self.completions.find_by_activity(
            db,
            activity.id
        ):
            difference = (
                new_final_xp
                - completion.xp_value_at_completion
            )

            if difference == 0:
                continue

            key = (
                f"activity-adjustment:"
                f"{activity.id}:"
                f"{completion.id}:"
                f"v{activity.version + 1}"
            )

            _, created = self.awards.award(
                db,
                completion.external_user_id,
                difference,
                "ACTIVITY_ADJUSTMENT",
                activity.id,
                key,
                source_completion_id=completion.id,
                transaction_type="ADJUSTMENT",
            )
    
            skill_awards = self.skill_xp.award_activity_skills(
                db, completion.external_user_id, activity, completion, None
            )
            skill_results = []
            for result in skill_awards:
                skill_total = self.skill_xp.total(db, completion.external_user_id, result["skill_id"])
                skill_level = self.skill_progression.update(
                    db, completion.external_user_id, result["skill_id"], skill_total
                )
                skill_results.append({
                    "skill_code": result["skill_code"],
                    "skill_name": result["skill_name"],
                    "xp_awarded": result["xp_awarded"],
                    "total_xp": skill_total,
                    **skill_level,
                })

            if not created:
                continue

            total = self.awards.total(
                db,
                completion.external_user_id
            )

            level = self.progression.update(
                db,
                completion.external_user_id,
                total
            )

            affected.append({
                "external_user_id": completion.external_user_id,
                "difference": difference,
                "new_total_xp": total,
                **level,
                "skill_results": skill_results,
            })

        return affected
    

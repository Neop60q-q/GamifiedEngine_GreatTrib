from database.models import Skill, SkillXPTransaction, CompletionSkillAward
from repositories.skill_repository import SkillRepository
from repositories.skill_xp_repository import SkillXPRepository


class SkillXPService:
    """Awards skill XP in addition to (never instead of) Global XP."""
    def __init__(self):
        self.skills = SkillRepository(); self.repo = SkillXPRepository()

    @staticmethod
    def calculate(global_xp: int, percentage: float) -> int:
        return round(global_xp * (percentage / 100.0))

    def award_activity_skills(self, db, external_user_id, activity, completion, event_id):
        results = []
        for allocation in self.skills.allocations_for_activity(db, activity.id):
            skill = db.get(Skill, allocation.skill_id)
            xp = self.calculate(activity.final_xp, allocation.percentage)
            key = f"skill-activity:{event_id}:skill:{allocation.skill_id}"
            existing = self.repo.find_by_key(db, key)
            created = False
            if existing is None:
                tx = SkillXPTransaction(external_user_id=external_user_id, skill_id=allocation.skill_id, amount=xp,
                    transaction_type="AWARD", source_type="ACTIVITY", source_id=activity.id,
                    source_completion_id=completion.id, idempotency_key=key)
                self.repo.save(db, tx); created = True
                self.repo.save_completion_snapshot(db, CompletionSkillAward(completion_id=completion.id,
                    skill_id=allocation.skill_id, percentage_at_completion=allocation.percentage, xp_value_at_completion=xp))
            results.append({"skill_id": allocation.skill_id, "skill_code": skill.code, "skill_name": skill.name,
                            "xp_awarded": xp if created else 0})
        return results

    def total(self, db, external_user_id, skill_id):
        return self.repo.total_for_user_skill(db, external_user_id, skill_id)

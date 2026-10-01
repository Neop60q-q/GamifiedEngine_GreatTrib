from database.models import StudentAchievement
from repositories.achievement_repository import AchievementRepository


class AchievementService:
    def __init__(self):
        self.repo = AchievementRepository()

    @staticmethod
    def _condition_met(condition, total_xp: int) -> bool:
        # The POC currently implements a generic TOTAL_XP condition.
        # New types such as ACTIVITY_COUNT can be added as additional evaluators.
        if condition.condition_type != "TOTAL_XP":
            return False

        if condition.operator == "GTE":
            return total_xp >= condition.target_value

        if condition.operator == "GT":
            return total_xp > condition.target_value

        if condition.operator == "EQ":
            return total_xp == condition.target_value

        return False

    def evaluate(self, db, external_user_id: str, total_xp: int):
        newly_awarded = []

        for achievement, conditions in self.repo.active_with_conditions(db):
            if self.repo.user_has(db, external_user_id, achievement.id):
                continue

            if conditions and all(
                self._condition_met(condition, total_xp) for condition in conditions
            ):
                record = StudentAchievement(
                    external_user_id=external_user_id,
                    achievement_id=achievement.id,
                    achievement_version=achievement.version,
                    bonus_xp_at_award=achievement.bonus_xp,
                )

                self.repo.award(db, record)

                newly_awarded.append(
                    {
                        "achievement": achievement,
                        "student_achievement": record,
                    }
                )

        return newly_awarded

from database.models import (
    Achievement,
    AchievementCondition,
    StudentAchievement,
)


class AchievementRepository:
    def active_with_conditions(self, db):
        achievements = (
            db.query(Achievement)
            .filter(Achievement.status == "Active")
            .all()
        )

        output = []

        for achievement in achievements:
            conditions = (
                db.query(AchievementCondition)
                .filter(
                    AchievementCondition.achievement_id
                    == achievement.id
                )
                .all()
            )

            output.append((achievement, conditions))

        return output

    def user_has(self, db, external_user_id: str, achievement_id: int):
        return (
            db.query(StudentAchievement)
            .filter(
                StudentAchievement.external_user_id == external_user_id,
                StudentAchievement.achievement_id == achievement_id
            )
            .first()
            is not None
        )

    def award(self, db, record: StudentAchievement):
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

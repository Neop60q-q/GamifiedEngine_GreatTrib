from database.models import ActivityCompletion


class CompletionRepository:
    def find_by_event(self, db, event_id: str):
        return (
            db.query(ActivityCompletion)
            .filter(ActivityCompletion.completion_event_id == event_id)
            .first()
        )

    def find_by_activity(self, db, activity_id: int):
        return (
            db.query(ActivityCompletion)
            .filter(ActivityCompletion.activity_id == activity_id)
            .all()
        )

    def find_for_user_activity(self, db, external_user_id: str, activity_id: int):
        return (
            db.query(ActivityCompletion)
            .filter(
                ActivityCompletion.external_user_id == external_user_id,
                ActivityCompletion.activity_id == activity_id,
                ActivityCompletion.verification_status == "APPROVED",
            )
            .order_by(ActivityCompletion.completed_at.desc())
            .all()
        )

    def latest_for_user_activity(self, db, external_user_id: str, activity_id: int):
        return (
            db.query(ActivityCompletion)
            .filter(
                ActivityCompletion.external_user_id == external_user_id,
                ActivityCompletion.activity_id == activity_id,
                ActivityCompletion.verification_status == "APPROVED",
            )
            .order_by(ActivityCompletion.completed_at.desc())
            .first()
        )

    def save(self, db, completion: ActivityCompletion):
        db.add(completion)
        db.commit()
        db.refresh(completion)
        return completion

from database.models import Activity, ActivityVersion


class ActivityRepository:
    def get_by_external_id(self, db, external_id: str):
        return (
            db.query(Activity)
            .filter(Activity.external_id == external_id)
            .first()
        )

    def save(self, db, activity: Activity):
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity

    def save_version(self, db, version: ActivityVersion):
        db.add(version)
        db.commit()
        db.refresh(version)
        return version

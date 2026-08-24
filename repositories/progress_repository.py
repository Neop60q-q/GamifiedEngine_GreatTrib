from database.models import StudentProgress


class ProgressRepository:
    def get(self, db, external_user_id: str):
        return db.get(StudentProgress, external_user_id)

    def upsert(self, db, external_user_id: str, total_xp: int, level: int):
        record = self.get(db, external_user_id)

        if record is None:
            record = StudentProgress(
                external_user_id=external_user_id,
                total_xp=total_xp,
                current_level=level
            )
            db.add(record)
        else:
            record.total_xp = total_xp
            record.current_level = level

        db.commit()
        db.refresh(record)
        return record

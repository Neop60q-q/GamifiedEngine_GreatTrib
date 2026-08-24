from database.models import LevelRule


class LevelRepository:
    def get_all(self, db):
        return (
            db.query(LevelRule)
            .order_by(LevelRule.required_xp.asc())
            .all()
        )

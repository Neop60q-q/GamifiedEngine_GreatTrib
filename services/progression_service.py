from repositories.level_repository import LevelRepository
from repositories.progress_repository import ProgressRepository


class ProgressionService:
    def __init__(self):
        self.levels = LevelRepository()
        self.progress = ProgressRepository()

    def level_for(self, db, total_xp: int):
        rules = self.levels.get_all(db)

        current = None

        for rule in rules:
            if total_xp >= rule.required_xp:
                current = rule

        return current

    def update(self, db, external_user_id: str, total_xp: int):
        previous = self.progress.get(db, external_user_id)
        previous_level = previous.current_level if previous else 1

        level_rule = self.level_for(db, total_xp)
        new_level = level_rule.level if level_rule else 1

        self.progress.upsert(
            db,
            external_user_id,
            total_xp,
            new_level
        )

        return {
            "previous_level": previous_level,
            "current_level": new_level,
            "level_up": new_level > previous_level,
            "unlock_code": (
                level_rule.unlock_code
                if level_rule and new_level > previous_level
                else None
            ),
            "unlock_name": (
                level_rule.unlock_name
                if level_rule and new_level > previous_level
                else None
            ),
        }

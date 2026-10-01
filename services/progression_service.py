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

        # Get all level rules from MySQL.
        rules = self.levels.get_all(db)

        # Determine current level.
        level_rule = self.level_for(db, total_xp)

        new_level = level_rule.level if level_rule else 1

        # Find the next configured level.
        next_rule = None

        for rule in rules:
            if rule.required_xp > total_xp:
                next_rule = rule
                break

        # Current level threshold.
        current_level_xp = level_rule.required_xp if level_rule else 0

        # --------------------------------------------------
        # Calculate progress toward next level
        # --------------------------------------------------

        if next_rule:
            next_level = next_rule.level
            next_level_xp = next_rule.required_xp

            xp_into_level = max(0, total_xp - current_level_xp)

            level_range = max(1, next_level_xp - current_level_xp)

            xp_to_next_level = max(0, next_level_xp - total_xp)

            level_progress_percent = round((xp_into_level / level_range) * 100, 2)

            is_max_level = False

        else:
            # Student is at the highest level currently
            # configured in MySQL.
            next_level = None
            next_level_xp = None

            xp_into_level = max(0, total_xp - current_level_xp)

            xp_to_next_level = 0
            level_progress_percent = 100

            is_max_level = True

        # Keep student_progress synchronised.
        self.progress.upsert(db, external_user_id, total_xp, new_level)

        return {
            # Existing fields
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
            # New progression information
            "current_level_xp": current_level_xp,
            "current_level_unlock_code": (
                level_rule.unlock_code if level_rule else None
            ),
            "current_level_unlock_name": (
                level_rule.unlock_name if level_rule else None
            ),
            "next_level": next_level,
            "next_level_xp": next_level_xp,
            "next_level_unlock_code": (next_rule.unlock_code if next_rule else None),
            "next_level_unlock_name": (next_rule.unlock_name if next_rule else None),
            "xp_into_level": xp_into_level,
            "xp_to_next_level": xp_to_next_level,
            "level_progress_percent": level_progress_percent,
            "is_max_level": is_max_level,
        }

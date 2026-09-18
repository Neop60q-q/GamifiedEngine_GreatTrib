from repositories.skill_progress_repository import SkillProgressRepository


class SkillProgressionService:
    def __init__(self): self.repo = SkillProgressRepository()

    def update(self, db, external_user_id: str, skill_id: int, total_xp: int):
        previous = self.repo.get(db, external_user_id, skill_id)
        previous_level = previous.current_level if previous else 1
        level = 1
        for rule in self.repo.level_rules(db, skill_id):
            if total_xp >= rule.required_xp: level = rule.level
        self.repo.upsert(db, external_user_id, skill_id, total_xp, level)
        return {"previous_level": previous_level, "current_level": level, "level_up": level > previous_level}

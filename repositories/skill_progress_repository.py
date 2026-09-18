from database.models import StudentSkillProgress, SkillLevelRule


class SkillProgressRepository:
    def get(self, db, external_user_id: str, skill_id: int):
        return db.query(StudentSkillProgress).filter(
            StudentSkillProgress.external_user_id == external_user_id,
            StudentSkillProgress.skill_id == skill_id,
        ).first()

    def upsert(self, db, external_user_id: str, skill_id: int, total_xp: int, level: int):
        record = self.get(db, external_user_id, skill_id)
        if record is None:
            record = StudentSkillProgress(external_user_id=external_user_id, skill_id=skill_id, total_xp=total_xp, current_level=level)
            db.add(record)
        else:
            record.total_xp = total_xp; record.current_level = level
        db.commit(); db.refresh(record); return record

    def level_rules(self, db, skill_id: int):
        specific = db.query(SkillLevelRule).filter(SkillLevelRule.skill_id == skill_id).order_by(SkillLevelRule.required_xp).all()
        if specific:
            return specific
        return db.query(SkillLevelRule).filter(SkillLevelRule.skill_id.is_(None)).order_by(SkillLevelRule.required_xp).all()

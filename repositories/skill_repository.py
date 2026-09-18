from database.models import Skill, ActivitySkillAllocation


class SkillRepository:
    def get_by_code(self, db, code: str):
        return db.query(Skill).filter(Skill.code == code).first()

    def get_by_external_id(self, db, external_id: str):
        return db.query(Skill).filter(Skill.external_id == external_id).first()

    def list_active(self, db):
        return db.query(Skill).filter(Skill.status == "Active").order_by(Skill.name).all()

    def save(self, db, skill: Skill):
        db.add(skill); db.commit(); db.refresh(skill); return skill

    def allocations_for_activity(self, db, activity_id: int):
        return db.query(ActivitySkillAllocation).filter(ActivitySkillAllocation.activity_id == activity_id).all()

    def replace_activity_allocations(self, db, activity_id: int, allocations):
        db.query(ActivitySkillAllocation).filter(ActivitySkillAllocation.activity_id == activity_id).delete()
        for allocation in allocations:
            db.add(allocation)
        db.commit()
        return self.allocations_for_activity(db, activity_id)

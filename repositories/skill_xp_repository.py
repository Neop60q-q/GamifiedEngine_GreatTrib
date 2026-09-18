from sqlalchemy import func
from database.models import SkillXPTransaction, CompletionSkillAward


class SkillXPRepository:
    def find_by_key(self, db, key: str):
        return db.query(SkillXPTransaction).filter(SkillXPTransaction.idempotency_key == key).first()

    def save(self, db, transaction):
        db.add(transaction); db.commit(); db.refresh(transaction); return transaction

    def total_for_user_skill(self, db, external_user_id: str, skill_id: int) -> int:
        value = db.query(func.coalesce(func.sum(SkillXPTransaction.amount), 0)).filter(
            SkillXPTransaction.external_user_id == external_user_id,
            SkillXPTransaction.skill_id == skill_id,
        ).scalar()
        return int(value or 0)

    def save_completion_snapshot(self, db, snapshot: CompletionSkillAward):
        db.add(snapshot); db.commit(); db.refresh(snapshot); return snapshot

    def snapshots_for_completion(self, db, completion_id: int):
        return db.query(CompletionSkillAward).filter(CompletionSkillAward.completion_id == completion_id).all()

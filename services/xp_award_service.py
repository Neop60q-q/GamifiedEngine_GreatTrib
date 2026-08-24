from database.models import XPTransaction
from repositories.xp_repository import XPRepository


class XPAwardService:
    def __init__(self):
        self.repo = XPRepository()

    def award(
        self,
        db,
        external_user_id: str,
        amount: int,
        source_type: str,
        source_id: int,
        idempotency_key: str,
        source_completion_id: int | None = None,
        transaction_type: str = "AWARD",
    ):
        existing = self.repo.find_by_key(
            db,
            idempotency_key
        )

        if existing:
            return existing, False

        transaction = XPTransaction(
            external_user_id=external_user_id,
            amount=amount,
            transaction_type=transaction_type,
            source_type=source_type,
            source_id=source_id,
            source_completion_id=source_completion_id,
            idempotency_key=idempotency_key
        )

        saved = self.repo.save(db, transaction)

        return saved, True

    def total(self, db, external_user_id: str) -> int:
        return self.repo.total_for_user(
            db,
            external_user_id
        )

from sqlalchemy import func

from database.models import XPTransaction


class XPRepository:
    def find_by_key(self, db, idempotency_key: str):
        return (
            db.query(XPTransaction)
            .filter(XPTransaction.idempotency_key == idempotency_key)
            .first()
        )

    def save(self, db, transaction: XPTransaction):
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        return transaction

    def total_for_user(self, db, external_user_id: str) -> int:
        total = (
            db.query(
                func.coalesce(
                    func.sum(XPTransaction.amount),
                    0
                )
            )
            .filter(XPTransaction.external_user_id == external_user_id)
            .scalar()
        )

        return int(total or 0)

    def transactions_for_user(self, db, external_user_id: str):
        return (
            db.query(XPTransaction)
            .filter(XPTransaction.external_user_id == external_user_id)
            .order_by(XPTransaction.id.asc())
            .all()
        )

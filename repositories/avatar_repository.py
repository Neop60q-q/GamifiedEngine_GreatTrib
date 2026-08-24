from database.models import (
    CosmeticItem,
    CosmeticRewardRule,
    StudentInventory,
    StudentAvatarEquipment,
)


class AvatarRepository:
    def item_by_code(self, db, code: str):
        return (
            db.query(CosmeticItem)
            .filter(CosmeticItem.code == code)
            .first()
        )

    def reward_items(self, db, source_type: str, source_code: str):
        rules = (
            db.query(CosmeticRewardRule)
            .filter(
                CosmeticRewardRule.source_type == source_type,
                CosmeticRewardRule.source_code == source_code,
                CosmeticRewardRule.active.is_(True)
            )
            .all()
        )

        items = []
        for rule in rules:
            item = db.get(CosmeticItem, rule.item_id)
            if item:
                items.append(item)

        return items

    def inventory_item(self, db, external_user_id: str, item_id: int):
        return (
            db.query(StudentInventory)
            .filter(
                StudentInventory.external_user_id == external_user_id,
                StudentInventory.item_id == item_id
            )
            .first()
        )

    def grant(self, db, record: StudentInventory):
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    def inventory(self, db, external_user_id: str):
        rows = (
            db.query(StudentInventory)
            .filter(StudentInventory.external_user_id == external_user_id)
            .all()
        )

        return [
            db.get(CosmeticItem, row.item_id)
            for row in rows
            if db.get(CosmeticItem, row.item_id) is not None
        ]

    def equip(self, db, external_user_id: str, item: CosmeticItem):
        record = (
            db.query(StudentAvatarEquipment)
            .filter(
                StudentAvatarEquipment.external_user_id == external_user_id,
                StudentAvatarEquipment.slot == item.slot
            )
            .first()
        )

        if record is None:
            record = StudentAvatarEquipment(
                external_user_id=external_user_id,
                slot=item.slot,
                item_id=item.id
            )
            db.add(record)
        else:
            record.item_id = item.id

        db.commit()
        db.refresh(record)
        return record

    def equipped(self, db, external_user_id: str):
        rows = (
            db.query(StudentAvatarEquipment)
            .filter(StudentAvatarEquipment.external_user_id == external_user_id)
            .all()
        )

        result = {}
        for row in rows:
            item = db.get(CosmeticItem, row.item_id)
            if item:
                result[row.slot] = item
        return result

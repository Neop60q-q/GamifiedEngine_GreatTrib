from database.models import StudentInventory
from repositories.avatar_repository import AvatarRepository


class AvatarRewardService:
    def __init__(self):
        self.repo = AvatarRepository()

    def grant_for_source(
        self,
        db,
        external_user_id: str,
        source_type: str,
        source_code: str,
        event_prefix: str,
    ):
        unlocked = []

        for item in self.repo.reward_items(db, source_type, source_code):
            if self.repo.inventory_item(db, external_user_id, item.id):
                continue

            reward_event_id = f"{event_prefix}:cosmetic:{item.code}"

            record = StudentInventory(
                external_user_id=external_user_id,
                item_id=item.id,
                reward_event_id=reward_event_id,
            )

            self.repo.grant(db, record)

            unlocked.append(
                {
                    "code": item.code,
                    "name": item.name,
                    "slot": item.slot,
                    "asset_key": item.asset_key,
                }
            )

        return unlocked

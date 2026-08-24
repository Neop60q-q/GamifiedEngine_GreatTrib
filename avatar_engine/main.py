from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from repositories.avatar_repository import AvatarRepository
from shared.models import AvatarEquipRequest


app = FastAPI(
    title="Alumable Avatar Engine v6",
    version="0.6.0"
)

avatars = AvatarRepository()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "avatar-engine"
    }


@app.get("/v1/avatar/{external_user_id}")
def get_avatar(
    external_user_id: str,
    db: Session = Depends(get_db)
):
    inventory = avatars.inventory(
        db,
        external_user_id
    )

    equipped = avatars.equipped(
        db,
        external_user_id
    )

    return {
        "external_user_id": external_user_id,
        "inventory": [
            {
                "code": item.code,
                "name": item.name,
                "slot": item.slot,
                "asset_key": item.asset_key,
                "rarity": item.rarity,
            }
            for item in inventory
        ],
        "equipped": {
            slot: {
                "code": item.code,
                "name": item.name,
                "asset_key": item.asset_key,
            }
            for slot, item in equipped.items()
        },
    }


@app.post("/v1/avatar/equip")
def equip_item(
    payload: AvatarEquipRequest,
    db: Session = Depends(get_db)
):
    item = avatars.item_by_code(
        db,
        payload.item_code
    )

    if item is None:
        raise HTTPException(
            404,
            "Cosmetic item not found"
        )

    owned = avatars.inventory_item(
        db,
        payload.external_user_id,
        item.id
    )

    if owned is None:
        raise HTTPException(
            403,
            "Student does not own this cosmetic item"
        )

    avatars.equip(
        db,
        payload.external_user_id,
        item
    )

    return get_avatar(
        payload.external_user_id,
        db
    )

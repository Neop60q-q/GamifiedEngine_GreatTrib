# Avatar API Contract (POC)

## GET /v1/avatar/{student_id}
Returns owned inventory and currently equipped items.

## POST /v1/avatar/rewards/grant
Internal service-to-service endpoint. Normally called after the XP Engine evaluates
a qualifying Activity, Challenge, Achievement or Level.

Example request:

```json
{
  "student_id": 101,
  "reward_source_type": "ACHIEVEMENT",
  "reward_source_id": 12,
  "item_id": 2,
  "event_id": "achievement:12:student:101:career-star-pin"
}
```

## POST /v1/avatar/equip
Called through Laravel after the logged-in student chooses an owned cosmetic.

```json
{
  "student_id": 101,
  "item_id": 2
}
```

The Avatar Engine must reject attempts to equip items not in the student's inventory.

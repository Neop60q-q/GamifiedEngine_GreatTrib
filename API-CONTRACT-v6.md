# Alumable Gamification v6 — Integration Contract

The Python services do not need to know Alumable's internal database schema.

Laravel maps Alumable's data into these stable contracts.

## Create Activity

`POST /v1/activities`

```json
{
  "creator_external_id": "employer-42",
  "creator_role": "EMPLOYER",
  "external_id": "activity-employer-assessment",
  "title": "Complete Employer Assessment",
  "description": "Complete the scenario task and receive employer approval.",
  "category": "Employment",
  "factors": {
    "difficulty": "DIFFICULT",
    "estimated_time_value": 3,
    "estimated_time_unit": "HOURS",
    "skill_level": "INTERMEDIATE",
    "effort": "HIGH",
    "complexity": "MULTI_STAGE",
    "student_impact": "HIGH",
    "verification_method": "EMPLOYER_APPROVAL",
    "repeatability": "ONE_TIME",
    "completion_type": "EMPLOYER_ACCEPTED"
  },
  "status": "Active"
}
```

The Creation Engine calculates and stores `final_xp`.

## Complete Activity

`POST /v1/completions/activity`

```json
{
  "event_id": "alumable-event-10001",
  "external_user_id": "student-101",
  "external_activity_id": "activity-employer-assessment",
  "approval_status": "APPROVED"
}
```

Example result:

```json
{
  "status": "completed",
  "activity_xp": 250,
  "achievement_bonus_xp": 50,
  "total_xp": 1400,
  "previous_level": 4,
  "current_level": 5,
  "level_up": true,
  "achievements_unlocked": [
    {
      "code": "CAREER_STARTER",
      "name": "Career Starter",
      "bonus_xp": 50
    }
  ],
  "cosmetics_unlocked": [
    {
      "code": "CAREER_STAR_PIN",
      "name": "Career Star Pin"
    }
  ]
}
```

## Student Progress

`GET /v1/students/{external_user_id}/progress`

## Recalculate an Activity

`POST /v1/recalculate/activity/{external_activity_id}`

```json
{
  "new_final_xp": 300
}
```

The engine creates ADJUSTMENT ledger entries for prior completions rather than
deleting or replacing the original XP transactions.

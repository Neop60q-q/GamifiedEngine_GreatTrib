# Future Activity Database Fields and Features

This document lists database fields and related features that can be added after
the MVP activity creation and persistence flow is working.

## Future activity fields

These fields should not be mandatory in the first activity creation form.

| Field | Type | Later use |
|---|---|---|
| `difficulty` | Enum/string | Adjust XP based on task difficulty. |
| `estimated_time_value` | Number | Store the expected activity duration. |
| `estimated_time_unit` | Enum/string | Represent minutes, hours, days, or weeks. |
| `skill_level` | Enum/string | Match activities to learner experience. |
| `effort` | Enum/string | Add effort weighting to XP. |
| `complexity` | Enum/string | Add complexity weighting to XP. |
| `student_impact` | Enum/string | Weight activities by learner impact. |
| `verification_method` | Enum/string | Define automatic, self-declared, educator, or employer verification. |
| `repeatability` | Enum/string | Support one-time, daily, weekly, monthly, or unlimited completion. |
| `completion_type` | Enum/string | Support attendance, submission, pass/fail, or score-based completion. |
| `recommended_xp` | Integer | Store engine-calculated XP separately from creator-adjusted XP. |
| `xp_rule_version` | Integer | Record which XP rule set produced the recommendation. |
| `start_date` | Date/time | Restrict when an activity is available. |
| `end_date` | Date/time | Set an activity closing date. |
| `version` | Integer | Track changes to an activity over time. |

## Future database tables

### Activity history

An `activity_versions` table can store immutable activity snapshots when editing
or XP rule changes need to be audited.

### Challenges

Add:

- `challenges`;
- `challenge_activities`;
- challenge completion rules;
- challenge XP and bonuses.

Challenges should reference existing activities rather than duplicate activity
data.

### Completion and verification

Add:

- student completion records;
- verification status;
- completion event IDs;
- XP transactions;
- idempotency keys.

### Achievements and rewards

Add:

- achievements;
- achievement conditions;
- student achievements;
- cosmetic reward rules;
- student inventory;
- avatar equipment.

### Authentication and integration

Replace the demo creator identity with the authenticated Laravel/Alumable
identity. Creator and student identifiers should remain stable at the API
boundary while internal database IDs remain implementation details.

## Future features by phase

### Phase 2: Basic XP

Start with a small set of additional fields:

- `difficulty`;
- `estimated_time_value`;
- `estimated_time_unit`;
- `recommended_xp`;
- `final_xp`.

This supports the XP panel from the design without requiring every advanced
factor.

### Phase 3: Advanced XP calculation

Add:

- `skill_level`;
- `effort`;
- `complexity`;
- `student_impact`;
- `verification_method`;
- `repeatability`;
- `completion_type`.

These fields should become required only when the related rules are implemented
and tested.

### Phase 4: Activity lifecycle

Support:

```text
Draft → Active → Inactive
```

This can include validation before publishing, editing, scheduling, and creator
permissions.

### Phase 5: Challenges and progression

Add challenges, completion tracking, XP transactions, achievements, and
progression integration as separate features. They should not be required for
basic activity creation.

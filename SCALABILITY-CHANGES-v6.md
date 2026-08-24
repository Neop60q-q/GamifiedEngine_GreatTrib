# v6 Scalability Changes

## What changed from v5

### 1. No in-memory XP ledger
v5:
- Python lists/dictionaries represented users, completions and inventory.

v6:
- SQLAlchemy repositories persist data to MySQL or SQLite.
- `xp_transactions` is the authoritative XP ledger.

### 2. Alumable IDs are integration-safe
v6 uses strings such as:
- `external_user_id`
- `external_activity_id`
- `creator_external_id`

Python does not depend on Alumable's table names or primary-key type.

### 3. XP Matrix is data-driven
Factor values are stored in:
- `xp_rule_sets`
- `xp_rule_values`

The calculation code reads the active rule set.

### 4. Level progression is data-driven
Thresholds are stored in `level_rules`.

### 5. Achievements are configurable
`achievements` and `achievement_conditions` make achievement logic extensible.

The POC implements `TOTAL_XP`; additional evaluators can later support:
- ACTIVITY_COUNT
- CHALLENGE_COUNT
- CATEGORY_COUNT
- ACTIVITY_COMPLETED
- CHALLENGE_COMPLETED

### 6. Cosmetic rewards are data-driven
`cosmetic_reward_rules` links a reward to:
- Activity
- Achievement
- Level

No Activity IDs are hard-coded inside the Avatar Engine.

### 7. Recalculation uses adjustments
Changing an Activity XP value:
- versions the Activity,
- finds prior completions,
- creates XP `ADJUSTMENT` transactions,
- recalculates totals and levels.

### 8. AWS is still outside the business logic
The same Python code runs:
- locally with SQLite,
- in Docker with MySQL,
- on AWS with RDS by changing `DATABASE_URL`.

### 9. Laravel is the adapter
Laravel maps Alumable's actual data model/authentication into stable Python API
contracts.

This isolates the Gamification Engine from Alumable implementation changes.

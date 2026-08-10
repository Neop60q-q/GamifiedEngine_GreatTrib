# Alumable XP Engine

Portal-neutral Laravel XP service based on the Alumable project brief. The student app, educator portal and employer portal use the same API and external student identifiers.

## Engine features

- Fixed phase-one activity, challenge and achievement definitions
- Idempotent XP awards with configurable repeatability
- Audited adjustments and explicit reversals
- Append-only XP transaction history
- Configurable level and capability thresholds seeded from the rules guide
- Shared-key protected JSON API under `/api/v1`

## Setup

Run `php artisan migrate --seed`, set a strong `XP_ENGINE_API_KEY`, and send it as the `X-XP-Engine-Key` header.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/v1/definitions` | Active reward definitions |
| GET | `/api/v1/levels` | Level and capability thresholds |
| GET | `/api/v1/students/{externalId}/progress` | Student progress and ledger |
| POST | `/api/v1/awards` | Award a configured definition |
| POST | `/api/v1/adjustments` | Apply an audited correction |
| POST | `/api/v1/transactions/{id}/reversal` | Reverse a transaction |

Example award body:

```json
{"student_external_id":"student-123","definition_code":"gig.complete","source_portal":"employer","source_reference":"completion-987","actor_external_id":"employer-42"}
```

`source_portal` plus `source_reference` is the idempotency key, so safe retries cannot award XP twice.

# Alumable Gamification Engine – Draft Prototype v3

This prototype is based on the supplied Educator/Employer Portal and Student Portal wireframes.

## Architecture

- **Laravel/PHP integration layer**: authentication, Alumable API integration, role/permission checks, portal requests.
- **Creation Engine (Python/FastAPI)**: creates Activities, Challenges and Achievements and requests XP calculations from the XP Engine.
- **XP Engine (Python/FastAPI)**: calculates XP, awards XP, evaluates challenges and achievements, recalculates totals, and determines level progression.
- **MySQL**: stores tasks, versions, completions, achievements, XP ledger and student progress.
- **AWS-ready**: intended for ECS/Fargate + RDS MySQL + ALB + Secrets Manager + CloudWatch.

## Prototype UI

Open these static pages in a browser:

- `prototype_ui/educator-employer.html`
- `prototype_ui/student.html`

They are lightweight visual prototypes based on the supplied Figma/PDF frames.

## Python services

### Creation Engine

```bash
uvicorn creation_engine.main:app --reload --port 8001
```

### XP Engine

```bash
uvicorn xp_engine.main:app --reload --port 8002
```

## Core lifecycle

1. Employer/Educator creates an Activity or Challenge.
2. Creation Engine validates the form.
3. Creation Engine asks XP Engine to calculate the final XP.
4. Task is persisted in MySQL.
5. Student completes an eligible task.
6. Laravel sends a verified completion event to XP Engine.
7. XP Engine records completion, awards task XP, checks Challenge progress and Achievements, adds bonus XP, recalculates total XP, and checks Level thresholds.
8. The XP transaction ledger remains the source of truth.
9. If a task or achievement reward changes later, the recalculation service issues adjustment transactions instead of deleting history.

## Important prototype assumptions

- XP weightings are examples only and require Project Manager approval.
- Challenge creation reuses Activity-style factors plus linked activities and completion rules.
- Custom Achievements may include optional bonus XP; permissions and caps require confirmation.
- Negative retroactive XP adjustments are technically supported but should be a business-rule decision.

## Interactive XP Engine demonstration (v4)

Open `prototype_ui/student.html` in a browser. The first student screen now contains two demonstration buttons:

1. **Complete Employer Assessment** — awards +250 Activity XP and triggers the draft **Career Starter** Achievement for +50 bonus XP. Jack moves from 890 XP to 1,190 XP.
2. **Attend Career Workshop** — awards +200 XP. Jack moves from 1,190 XP to 1,390 XP, crosses the 1,350 XP threshold, reaches **Level 5**, and unlocks **Advanced Opportunities**.

The UI updates the XP total, progress bar, level ladder, Recent XP list, Achievement badge and an **XP Engine Trace** panel. The trace is intentionally plain-English so it can be demonstrated to non-technical team members.

This browser demo uses JavaScript to simulate the same workflow represented by the Python XP Engine, so it can be viewed without running Python/MySQL. The Python service remains in `xp_engine/` for API demonstrations.

## Avatar & Campus Hub proof-of-concept

Open:

`prototype_ui/avatar-space.html`

in a browser.

The page demonstrates:
- avatar customisation
- locked and owned cosmetics
- Activity/Achievement/Level cosmetic rewards
- a simulated Campus Hub with keyboard movement
- other visible avatars
- a simple local chat mock-up

Click **Complete Employer Assessment** on the avatar page to simulate the existing
XP Engine awarding XP, an achievement bonus, and cosmetic rewards. The Career
Blazer, Career Star Pin and Level 5 Gold Jacket become available.

The browser demo is intentionally self-contained. The backend folders show the
recommended Python/Laravel/MySQL integration for a real implementation.

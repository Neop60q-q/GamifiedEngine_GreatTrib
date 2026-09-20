# Alumable Gamification Prototype v6 — Scalable Backend POC

This version evolves the v5 Avatar proof-of-concept toward a backend Alumable can
integrate without needing to share its internal database structure.

## What is included

- Creation Engine — FastAPI / Python
- XP Engine — FastAPI / Python
- Avatar Engine — FastAPI / Python
- SQLAlchemy repository/data-access layer and schema models
- MySQL persistent database through `mysql+pymysql`
- SQLite easy-local mode
- configurable XP Matrix
- configurable level thresholds
- configurable achievement condition example
- configurable cosmetic reward rules
- XP transaction ledger
- Activity versioning and retroactive XP adjustments
- external Alumable IDs
- Laravel integration examples
- Docker Compose + MySQL
- existing Student, Employer/Educator and Avatar browser demos

## Database source of truth

The SQLAlchemy models in `database/models.py` are the single schema definition
for the application. Initialize the database with:

```powershell
.venv\Scripts\python.exe -m scripts.init_db
.venv\Scripts\python.exe -m scripts.seed_demo
```

Both commands use the `DATABASE_URL` environment variable. There is no separate
handwritten SQL schema to keep in sync.

For the recommended MySQL mode, set:

```text
DATABASE_URL=mysql+pymysql://gamification:gamification@localhost:3306/gamification
```

In MySQL Workbench, connect to `localhost:3306` with username `gamification`
and password `gamification`, then open the `gamification` schema. If Docker is
used, run `docker compose up --build`; the `db-seed` container creates the
tables from SQLAlchemy metadata before the API containers start.

---

## Option A — easiest run, no MySQL required

From the project directory:

### Windows PowerShell

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

python -m scripts.seed_demo

uvicorn creation_engine.main:app --reload --port 8001
```

Open a second terminal:

```powershell
.venv\Scripts\Activate.ps1
uvicorn xp_engine.main:app --reload --port 8002
```

Open a third terminal:

```powershell
.venv\Scripts\Activate.ps1
uvicorn avatar_engine.main:app --reload --port 8003
```

The default database is:

`gamification.db`

which is a local SQLite file.

API documentation:

- Creation Engine: http://localhost:8001/docs
- XP Engine: http://localhost:8002/docs
- Avatar Engine: http://localhost:8003/docs

This mode is for learning and quick demonstration.

---

## Option B — run the scalable MySQL version with Docker

Install Docker Desktop, then:

```bash
docker compose up --build
```

Docker starts:

- MySQL — port 3306
- Creation Engine — port 8001
- XP Engine — port 8002
- Avatar Engine — port 8003

The `db-seed` container creates the tables and example XP rules first.

---

## Test the scalable flow

### 1. Create an Activity

Open:

http://localhost:8001/docs

Use:

`POST /v1/activities`

Example:

```json
{
  "creator_external_id": "employer-42",
  "creator_role": "EMPLOYER",
  "external_id": "activity-employer-assessment",
  "title": "Complete Employer Assessment",
  "description": "Complete and receive employer approval.",
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

Notice that you do NOT send the XP.

The Python XP calculator reads the active XP rule matrix and returns/stores
`final_xp`.

### 2. Complete it

Open:

http://localhost:8002/docs

Use:

`POST /v1/completions/activity`

```json
{
  "event_id": "demo-completion-1",
  "external_user_id": "student-101",
  "external_activity_id": "activity-employer-assessment",
  "approval_status": "APPROVED"
}
```

The engine will:

1. locate the Activity by external ID,
2. reject duplicate completion event IDs,
3. record the completion,
4. create the Activity XP ledger transaction,
5. calculate total XP,
6. evaluate achievements,
7. add achievement bonus XP,
8. evaluate level progression,
9. grant matching cosmetic rewards,
10. update `student_progress`,
11. return one structured result to Laravel/React.

### 3. Retry the same event

Send exactly the same request again.

The result should show `duplicate`.

The Activity XP is not awarded twice.

### 4. See progress

`GET /v1/students/student-101/progress`

### 5. See Avatar inventory

Open:

http://localhost:8003/docs

`GET /v1/avatar/student-101`

### 6. Recalculate the Activity

Use:

`POST /v1/recalculate/activity/activity-employer-assessment`

```json
{
  "new_final_xp": 300
}
```

The original XP transaction remains.

The engine creates an ADJUSTMENT transaction for affected students.

---

## Browser UI demos

These remain self-contained visual demonstrations:

- `prototype_ui/educator-employer.html`
- `prototype_ui/student.html`
- `prototype_ui/avatar-space.html`

They are not yet wired to the v6 APIs. That should be done when the frontend
moves to React/React Native.

---

## How this maps to Alumable

React / React Native
→ Alumable Laravel API
→ Python Gamification APIs
→ MySQL

Laravel owns:
- Alumable authentication
- real Alumable user IDs
- Alumable API translation
- permissions

Python owns:
- Gamification rules
- XP calculation
- XP ledger
- Achievement evaluation
- level progression
- recalculation
- cosmetic rewards

MySQL owns:
- Gamification state and history

AWS later hosts:
- Laravel/Python containers on ECS/Fargate
- MySQL on RDS
- secrets in Secrets Manager
- logs in CloudWatch

No XP business logic needs to know it is running on AWS.

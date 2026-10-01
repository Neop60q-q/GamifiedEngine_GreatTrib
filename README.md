# Alumable Gamification Engine Prototype

This repository contains a proof-of-concept gamification system for
Alumable. It demonstrates how educators/employers can create activities,
how students can complete those activities for XP, how XP is split
across skills, how levels and achievements are calculated, and how
cosmetic/avatar rewards can be unlocked.

The prototype is designed so the user interfaces remain separate from
the gamification rules. MySQL stores the data and configurable rules,
the Python services apply the gamification logic, and the React frontend
displays the results.

## Prototype architecture

The current prototype contains five main parts:

  ------------------------------------------------------------------------
  Component             Purpose                                 Local port
  --------------------- --------------------- ----------------------------
  MySQL                 Stores activities, XP                       `3306`
                        transactions,         
                        progress, skills,     
                        achievements, level   
                        rules and cosmetic    
                        rewards               

  Creation Engine       Creates and retrieves                       `8001`
                        activities and        
                        calculates their      
                        configured XP value   

  XP Engine             Processes                                   `8002`
                        completions, awards   
                        XP and skill XP,      
                        evaluates             
                        achievements, updates 
                        levels and grants     
                        rewards               

  Avatar Engine         Reads a student's                           `8003`
                        cosmetic inventory    
                        and manages equipped  
                        avatar items          

  React/Vite Frontend   Student UI,                                 `5173`
                        educator/employer     
                        portal and design     
                        prototype             
  ------------------------------------------------------------------------

The three Python services use FastAPI. Docker Compose starts MySQL,
seeds the demonstration data and starts the Python services. The React
frontend is run separately with Node.js/Vite.

## Requirements

Install the following before running the prototype:

-   Docker Desktop for Windows
-   Node.js `22.12.0` or newer
-   npm
-   Git is recommended if the project is being managed through GitHub

Python does not need to be installed locally when using the Docker setup
because the Python services run inside Docker containers.

Make sure Docker Desktop is running before using the Docker commands
below.

## Running the prototype

### 1. Open the project

Open PowerShell or the VS Code terminal and move into the root project
directory:

``` powershell
cd "path\to\GamifiedEngine_GreatTrib"
```

The root directory is the folder containing `docker-compose.yml`.

### 2. Start MySQL and the backend services

For a normal start:

``` powershell
docker compose up
```

When Python/backend code or Docker configuration has changed, rebuild
the containers:

``` powershell
docker compose up --build
```

To run the containers without keeping their logs attached to the
terminal:

``` powershell
docker compose up -d --build
```

Docker Compose starts:

-   MySQL
-   the database seed process
-   Creation Engine
-   XP Engine
-   Avatar Engine

Check that the services are running:

``` powershell
docker compose ps
```

MySQL should report as healthy and the backend services should be
running.

### 3. Start the React frontend

Open a second terminal:

``` powershell
cd frontend
npm install
npm run dev
```

`npm install` is normally only required the first time, or when frontend
dependencies change.

Vite runs the frontend at:

``` text
http://127.0.0.1:5173
```

Open that address in a browser.

The prototype landing page provides quick access to:

-   **Student UI** --- `/student-ui`
-   **Portal** --- `/portal-ui`
-   **HTML/design prototype** --- `/prototype`

### 4. Stop the prototype

Stop the frontend with `Ctrl + C`.

If Docker Compose is running in the foreground, use `Ctrl + C`. To stop
and remove the running containers:

``` powershell
docker compose down
```

The MySQL data is stored in the Docker volume `gamification_mysql`, so
`docker compose down` does not normally erase the database.

To deliberately remove the database volume and start with a fresh seeded
database:

``` powershell
docker compose down -v
docker compose up --build
```

Use `-v` only when you intentionally want to reset the prototype
database.

## How the system interacts

### Creating an activity

The educator/employer Portal sends activity data from the React frontend
to the Creation Engine.

``` text
React Portal
    ↓
Creation Engine :8001
    ↓
XP calculation / activity validation
    ↓
MySQL
```

The frontend accesses the Creation Engine through Vite's `/creation-api`
proxy.

The Creation Engine:

1.  receives the activity information;
2.  calculates the activity XP using the configured XP factors;
3.  validates skill allocations;
4.  stores the activity and its version in MySQL;
5.  stores skill allocations and an optional cosmetic reward rule; and
6.  returns the saved activity to the frontend.

Activities marked `Active` are available to the Student UI.

### Completing an activity

When a student completes an active activity, the Student UI sends a
completion event to the XP Engine.

``` text
Student UI
    ↓
XP Engine :8002
    ↓
Activity completion
    ├── Activity XP
    ├── Skill XP
    ├── Achievement checks
    ├── Achievement bonus XP
    ├── Level progression
    └── Cosmetic rewards
    ↓
MySQL
    ↓
Completion result returned to React
```

The frontend accesses the XP Engine through Vite's `/xp-api` proxy.

The XP Engine checks that the activity exists and is active, prevents
duplicate completion events, records the completion and creates XP
transactions.

The activity's skill allocations are also used to award XP to individual
skills such as Software Development, Cybersecurity and Communication.

After XP is awarded, the engine evaluates achievements and level
progression. Any applicable cosmetic rewards are also granted.

The returned completion result is used by the Student UI's completion
screen to show the XP earned, skill XP, level changes and unlocked
rewards.

## XP and level progression

General XP is the student's overall progression score. Skill XP is
tracked separately and does not replace the general XP total.

For example, an activity can award:

``` text
220 total XP
├── Software Development: 132 skill XP
├── Cybersecurity:          66 skill XP
└── Communication:          22 skill XP
```

The student's overall level is based on total XP.

Level thresholds are stored in MySQL in the `level_rules` table. The
frontend does not maintain a separate hard-coded level table.

The XP Engine reads the configured rules and returns progression
information including:

-   current level;
-   current level XP threshold;
-   next level;
-   next level XP threshold;
-   XP earned within the current level;
-   XP remaining until the next level;
-   progress percentage;
-   current/next level unlock information; and
-   whether the student has reached the highest configured level.

This same API data is used by the Student Dashboard, Learn → Progress
and the completion screen so they remain consistent.

## Student progress

The frontend requests progress from:

``` text
GET /v1/students/{external_user_id}/progress
```

The current prototype defaults to:

``` text
demo-student-1
```

The XP Engine calculates total XP from the XP transaction ledger, reads
skill XP transactions, evaluates the current level against
`level_rules`, synchronises `student_progress`, and returns the complete
progress response.

The XP transaction data is therefore the main source used to calculate
the student's XP total rather than relying only on a number stored in
the UI.

## Avatar and cosmetic rewards

The Avatar Engine is available on port `8003`.

It can:

-   return a student's owned cosmetic items;
-   return currently equipped items; and
-   equip an item when the student owns it.

Cosmetic rewards can be associated with activities, achievements or
levels. The XP Engine grants applicable cosmetic items during the
completion workflow.

The current React student experience demonstrates the gamification
workflow, while the avatar system remains a proof-of-concept area that
can be expanded with future avatar graphics and virtual-space
functionality.

## Database

The Docker configuration creates the MySQL database:

``` text
gamification
```

The normal application user configured by Docker Compose is:

``` text
username: gamification
password: gamification
```

The local prototype root password is:

``` text
root
```

To enter MySQL while the containers are running:

``` powershell
docker compose exec mysql mysql -u root -p
```

Enter:

``` text
root
```

Then select the database:

``` sql
USE gamification;
```

Useful commands include:

``` sql
SHOW TABLES;
```

``` sql
SELECT * FROM student_progress;
```

``` sql
SELECT * FROM level_rules ORDER BY level;
```

``` sql
SELECT * FROM xp_transactions ORDER BY created_at DESC;
```

``` sql
SELECT * FROM skill_xp_transactions ORDER BY created_at DESC;
```

## Backend service checks

The FastAPI services expose health endpoints:

``` text
http://127.0.0.1:8001/health
http://127.0.0.1:8002/health
http://127.0.0.1:8003/health
```

FastAPI also provides interactive API documentation:

``` text
http://127.0.0.1:8001/docs
http://127.0.0.1:8002/docs
http://127.0.0.1:8003/docs
```

These pages are useful for checking the APIs independently of React.

## Frontend/backend connection

During development, Vite proxies frontend requests to the Python
services:

``` text
/creation-api → http://127.0.0.1:8001
/xp-api       → http://127.0.0.1:8002
```

This configuration is in:

``` text
frontend/vite.config.ts
```

The activity API functions are in:

``` text
frontend/src/features/activity-creation/api.ts
```

The XP/progress API functions are in:

``` text
frontend/src/features/xp/api.ts
```

This separation means the React components do not need to contain
backend URLs throughout the UI.

## Main project structure

``` text
.
├── avatar_engine/           Avatar inventory/equipment API
├── creation_engine/         Activity creation API
├── database/                SQLAlchemy connection and database models
├── frontend/                React/Vite prototype
│   └── src/
│       ├── features/
│       │   ├── activity-creation/
│       │   ├── design-prototype/
│       │   ├── portal-ui/
│       │   ├── student-ui/
│       │   └── xp/
│       └── shared/
├── repositories/            Database access layer
├── scripts/                 Database initialisation/demo seed
├── services/                XP, progression, achievement and reward logic
├── shared/                  Shared Python configuration/models
├── tests/                   Python tests
├── xp_engine/               Completion and student progress API
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md
```

## Testing and useful commands

Run the Python test suite inside the project environment/container as
appropriate:

``` powershell
pytest
```

Frontend type checking:

``` powershell
cd frontend
npm run typecheck
```

Frontend production build check:

``` powershell
npm run build
```

If the frontend cannot reach a backend service, first check:

``` powershell
docker compose ps
```

Then check the relevant `/health` URL.

If Docker reports that it cannot connect to the Docker API or daemon,
start Docker Desktop before retrying.

If backend Python code has changed but the running service still behaves
like the old version, rebuild:

``` powershell
docker compose down
docker compose up --build
```

## Current prototype scope

The prototype demonstrates the technical connection between activity
creation, persistent MySQL data, activity completion, total XP, split
skill XP, achievements, level progression and cosmetic rewards.

Some interface areas, including parts of Earn, Messages, Portfolio and
the wider virtual/avatar experience, are intentionally demonstration or
future-integration areas rather than complete production features.

Authentication is also intentionally outside the current
proof-of-concept. The prototype uses demonstration external IDs such as
`demo-student-1`. In a future Alumable integration, those IDs can be
supplied by the existing authentication/API layer without moving the
gamification rules into the frontend.

# Architecture

## Overview

DevFolio is a polyglot monorepo. The same resume data contract is implemented independently by each backend language and rendered independently by each frontend framework. A shared TypeScript interface library enforces the contract at compile time.

The goal is not abstraction for its own sake — it is to demonstrate that each implementation is genuinely real, not scaffolded or mocked.

---

## Monorepo Structure

**Tooling:** pnpm workspaces + Nx

Nx provides task orchestration, dependency graph awareness, and build caching. pnpm handles package installation with strict hoisting. Python projects are managed via `@nxlv/python` with `uv` as the package manager inside Docker.

```
devfolio/
├── apps/          # Deployable applications (thin shells)
├── libs/          # Shared libraries (all reusable logic lives here)
│   ├── shared/    # Language-agnostic contracts (TypeScript)
│   ├── frontend/  # Framework-specific UI component libraries
│   └── backend/   # Language-specific domain libraries
└── docs/          # Project documentation
```

**Design principle:** Apps are thin. Libraries are thick. An app should do nothing more than wire together libs, configure routing, and handle environment concerns.

---

## Shared Contracts

**Package:** `@devfolio/shared-interfaces` (`libs/shared/interfaces`)

Every frontend and every backend must conform to the types defined here. This single source of truth prevents the stacks from drifting apart.

Key modules:

| File | Contents |
|---|---|
| `domain.ts` | `Profile`, `WorkExperience`, `Education`, `Skill`, `Project` |
| `tech-stack.ts` | `TechStackInfo`, `RuntimeInfo`, `DatabaseInfo`, `FrameworkInfo` |
| `api.ts` | `ApiResponse<T>`, `ApiMeta`, `StackIdentifier` |
| `stack-selector.ts` | `StackOption`, `StackSelection`, `FrontendStack`, `BackendStack` |
| `validators.ts` | Runtime type guards (`isProfile`, `isTechStackInfo`, etc.) |

---

## API Contract

All endpoints return the same envelope:

```typescript
interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;   // ISO 8601
    stack: {
      backend: string;   // "FastAPI 0.115.x"
      database: string;  // "PostgreSQL 17.x"
    };
    durationMs: number;
  };
}
```

### Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/profile?resume=fullstack` | Profile and summary |
| GET | `/work-experience?resume=fullstack` | Work history with highlights |
| GET | `/education?resume=fullstack` | Education records |
| GET | `/skills?resume=fullstack` | Categorised skill list |
| GET | `/projects` | Featured projects |
| GET | `/tech-stack` | Live runtime introspection |

The `resume` parameter accepts `fullstack` or `dotnet` and selects the appropriate variant from the database.

---

## Data Flow

```
Browser
  └─► React App (web-react)
        └─► useResumeApi(endpoint, resume)
              └─► useFetch(url)           ← @devfolio/shared-hooks
                    └─► FastAPI (api-python)
                          └─► ResumeService
                                └─► PostgresRepository
                                      └─► Supabase PostgreSQL
```

On startup, if `DATABASE_URL` is set, the API:
1. Creates an asyncpg connection pool (session mode, port 5432)
2. Runs the seeder (idempotent upserts)
3. Injects `PostgresRepository` into `ResumeService`

If `DATABASE_URL` is absent, `SeedRepository` is injected instead — the app runs entirely from in-memory JSON data. This enables local development and testing without a database.

---

## Database

**Provider:** Supabase (managed PostgreSQL)  
**Pooler:** Session mode (port 5432) — required for asyncpg prepared statements and future RLS support  
**ORM:** None — raw asyncpg queries for transparency and control

Schema is maintained in `libs/backend/resume-python/data/schema.sql`. Applied manually via the Supabase SQL editor. Future phases will introduce migrations.

### Key Tables

```
resumes          → slug, label, is_default
profiles         → resume_slug, name, title, clearance, summary, ...
companies        → slug, name, location
roles            → slug, company_slug, title, start_date, end_date
highlights       → role_slug, resume_slug, body, sort_order
education        → slug, institution, degree, field, ...
skill_categories → resume_slug, name, sort_order
skills           → category_id, name, proficiency, years_of_experience
projects         → slug, name, description, featured, ...
```

---

## Frontend Architecture

### web-react (Phase 1)

Built with React 19 + Vite. Component structure:

```
apps/web-react/src/
├── app/
│   ├── app.tsx              # Shell — state and composition only
│   └── stack/
│       └── TechStackTab.tsx
├── components/
│   ├── layout/              # Header, Hero
│   ├── portfolio/           # ExperienceTab, EducationTab, SkillsTab, ProjectsTab
│   └── resume/              # ResumeSelector
└── hooks/
    └── useResumeApi.ts      # Thin wrapper: API_BASE + resume param → useFetch
```

`useResumeApi` is intentionally app-local. It knows about `VITE_API_BASE` and the `?resume=` parameter pattern. The underlying `useFetch` in `@devfolio/shared-hooks` is generic and will be reused by Angular and Vue without modification.

---

## Key Decisions

**Session pooler over transaction pooler** — asyncpg uses prepared statements that require a persistent connection. Session mode also enables future `SET` variable usage for Row Level Security.

**No ORM** — Raw SQL keeps the data layer readable and portable. When Rails and Django arrive, their ORMs will be used conventionally — the contrast is intentional.

**Seed fallback** — The repository pattern with a `SeedRepository` fallback means the entire app works without a database. This is not a hack — it is a deliberate design decision that makes the test suite fast and CI simple.

**Shared interfaces over code generation** — TypeScript interfaces are the contract. No OpenAPI codegen, no GraphQL schema stitching. When a new backend is added, it must satisfy the same interface manually — which is the point.

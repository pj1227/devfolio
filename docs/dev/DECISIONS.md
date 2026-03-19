# Architectural Decision Records

Decisions made during development, with context and reasoning. Updated as new decisions are made.

---

## ADR-001 — Session Pooler over Transaction Pooler (Supabase)

**Date:** 2026-03  
**Status:** Accepted

### Context
Supabase offers two connection pooler modes: transaction (port 6543) and session (port 5432). We needed to choose one for the asyncpg connection pool in FastAPI.

### Decision
Use session mode (port 5432).

### Reasoning
- asyncpg uses prepared statements aggressively. Transaction mode does not support prepared statements that persist across queries — they would need to be explicitly disabled, adding friction and reducing performance
- Session mode holds one connection per client session, behaving like a direct connection — asyncpg works naturally with no configuration changes
- Future Row Level Security (RLS) implementation requires `SET app.current_user_id = ...` style session variables, which only work in session mode
- At DevFolio's traffic levels, the connection efficiency advantage of transaction mode is irrelevant

### Consequences
- Connection string uses port 5432, not 6543
- Each connected client holds a Supabase connection for the session duration — acceptable at low concurrency

---

## ADR-002 — No ORM (Raw asyncpg)

**Date:** 2026-03  
**Status:** Accepted

### Context
Python has several mature ORM options (SQLAlchemy, Tortoise ORM, Django ORM). We needed to decide whether to use one for the FastAPI backend.

### Decision
Use raw asyncpg queries. No ORM.

### Reasoning
- Transparency — SQL queries are readable and unambiguous. No hidden N+1 queries or lazy loading surprises
- Portability of the pattern — when Rails, Django, and other backends are added, each will use its own idiomatic data access (ActiveRecord, Django ORM). The contrast between approaches is intentional and worth showing
- Control — complex resume queries with variant filtering and sort ordering are easier to reason about in SQL than through ORM query builders
- The repository pattern isolates database access regardless of whether an ORM is used — swapping to SQLAlchemy later would only affect the repository layer

### Consequences
- All queries written and maintained manually
- No automatic migration tooling — schema managed via `schema.sql` applied in Supabase SQL editor
- Future phases will introduce proper migrations

---

## ADR-003 — Repository Pattern with SeedRepository Fallback

**Date:** 2026-03  
**Status:** Accepted

### Context
The application needs to work in multiple environments: local development without a database, CI without a database, and production with Supabase.

### Decision
Implement a repository interface with two concrete implementations: `PostgresRepository` (live database) and `SeedRepository` (in-memory JSON data). The app detects `DATABASE_URL` at startup and injects the appropriate implementation into `ResumeService`.

### Reasoning
- Tests run fast and require no database setup — `SeedRepository` provides deterministic data
- CI never needs `DATABASE_URL` — the entire test suite passes without a live database
- Local development works immediately after `git clone` without any database configuration
- The pattern is language-agnostic — every new backend (Rails, Django, etc.) must implement the same repository interface for its language

### Consequences
- Every backend must maintain both a seed repository and a real repository
- `SeedRepository` data must be kept in sync with the database schema
- The seeder (`seeder.py`) bridges the two — it reads the same JSON that `SeedRepository` uses and upserts it into Postgres

---

## ADR-004 — Shared TypeScript Interfaces over Code Generation

**Date:** 2026-03  
**Status:** Accepted

### Context
With multiple frontends and backends needing to agree on data shapes, we needed a strategy for maintaining a single source of truth for the API contract.

### Decision
Hand-authored TypeScript interfaces in `@devfolio/shared-interfaces` (`libs/shared/interfaces`). No OpenAPI codegen, no GraphQL schema stitching, no JSON Schema generation.

### Reasoning
- Simplicity — one file per domain area, plain TypeScript, no toolchain complexity
- Consumed directly by all TypeScript frontends (React, Angular, Vue, Next.js) without any transformation
- Runtime type guards (`validators.ts`) provide the same safety that codegen would, with full control over the validation logic
- When non-TypeScript frontends arrive (Blazor, Vanilla JS), the interfaces serve as the specification document rather than a code artifact

### Consequences
- New backends must satisfy the contract manually — no generated client code
- Interface changes must be made by hand and propagated carefully
- The validators in `validators.ts` must be kept in sync with the interfaces manually

---

## ADR-005 — Monorepo with pnpm + Nx

**Date:** 2026-03  
**Status:** Accepted

### Context
DevFolio spans multiple languages, frameworks, and runtimes. We needed a monorepo tool that could handle TypeScript, Python, and future Ruby/PHP/.NET projects in a single workspace.

### Decision
pnpm workspaces for Node.js package management, Nx for task orchestration and project graph awareness. Python projects managed via `@nxlv/python` plugin with `uv` as the Python package manager inside Docker.

### Reasoning
- Nx handles polyglot monorepos well — the `@nxlv/python` plugin integrates Python projects into the Nx task graph alongside TypeScript projects
- pnpm's strict hoisting avoids phantom dependency issues common in npm/yarn monorepos
- Nx build caching means unchanged projects are not rebuilt — important as the number of apps and libs grows
- Nx generators scaffold new apps and libs consistently, enforcing the same project structure across languages

### Consequences
- `uv` is available inside Docker but not on the host — Python deps managed via Docker for the API, directly via `pip` for standalone scripts like the seeder
- `nx list` can hang in WSL2 — use `npx nx` instead of the global `nx` binary
- As more languages are added, additional Nx plugins will be needed (e.g. `@nx/dotnet` for C#)

---

## ADR-006 — Docker Compose for Local Development

**Date:** 2026-03  
**Status:** Accepted

### Context
The project has multiple services (frontend, backend, eventually many backends) that need to run together locally.

### Decision
Docker Compose for all local multi-service orchestration. Each service has its own `Dockerfile`. Environment variables loaded from a root `.env` file (gitignored).

### Reasoning
- Consistent environment across machines (WSL2 Ubuntu, Windows AMD, macOS) — eliminates "works on my machine" problems
- Each service is isolated — no Python version conflicts, no Node version conflicts
- `.env` at the workspace root is loaded by Compose and never committed — keeps secrets out of the repo
- The same Docker images are deployable to Railway/Render with minimal configuration changes

### Consequences
- First build on a new machine is slow (downloading base images, installing dependencies)
- `uv` installs Python deps inside the container at build time — host Python is only used for standalone scripts
- Hot reload works via volume mounts — code changes reflect immediately without rebuilding

---

## ADR-007 — Staging Branch Strategy

**Date:** 2026-03  
**Status:** Accepted

### Context
Phase 1 was developed directly on `main` to establish the foundation quickly. Going forward, a more structured branching strategy was needed.

### Decision
Three-tier branch strategy: `main` (production), `staging` (integration), `feature/*` (work in progress). All feature branches cut from `staging`, PR'd back to `staging`. `staging` merged to `main` at phase/milestone boundaries.

### Reasoning
- `main` always represents the live deployed state — no broken code ever reaches production
- `staging` is the integration point — feature branches are verified together before promoting
- Feature branches are cheap and short-lived — one per chunk of work, deleted after merge
- Preview deployments on Vercel are automatically created for every branch, giving a live URL for every feature branch

### Consequences
- No direct commits to `main` after Phase 1
- Every piece of work, however small, requires a branch and a merge
- `staging` may occasionally be ahead of `main` — that is intentional

---

## ADR-008 — Session Pooler Connection String Region

**Date:** 2026-03  
**Status:** Accepted

### Context
The Supabase project is hosted in `us-west-2`. The connection string region must match the actual project region.

### Decision
Use `aws-0-us-west-2.pooler.supabase.com` in all connection strings.

### Note
Early in development, `aws-0-us-east-1` was used and caused `Tenant or user not found` errors. The correct region is `us-west-2`. All `.env` files and documentation use the `us-west-2` endpoint.

### Connection string format
```
postgresql://postgres.<project-ref>:<password>@aws-0-us-west-2.pooler.supabase.com:5432/postgres
```
---

## ADR-009 — Railway Port Configuration for Rails

**Date:** 2026-03  
**Status:** Accepted

### Context
Railway routes external traffic to a specific port based on the `PORT` environment
variable set in the service variables — it does not inject PORT into the container.
The app must explicitly bind to the same port that Railway expects.

### Decision
Set `PORT = 8000` in Railway Variables for all services. All services bind to 8000.

### Gotchas Encountered
- `railway.json` startCommand takes highest priority over Dockerfile CMD and puma.rb
- If startCommand has a hardcoded port it overrides everything else
- Railway's build cache can prevent updated files from being picked up — add a comment
  to the Dockerfile to bust the cache when needed
- Railway reads the PORT variable to configure its proxy, it does not inject it into
  the container environment
```

While DNS propagates, check progress at:
```
https://dnschecker.org/#CNAME/api-rails.joelcossins.dev
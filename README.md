# DevFolio

> A polyglot full-stack portfolio that proves every implementation is real.

DevFolio serves the same resume data from multiple frontend frameworks and backend languages — simultaneously. A live dashboard lets visitors select any combination of frontend, backend, query language, and database to see the portfolio rendered by that exact stack in real time.

This is not a mockup. Every endpoint is live. Every tech-stack card is generated from runtime introspection.

---

## What It Demonstrates

- **Monorepo discipline** — pnpm + Nx managing Python, TypeScript, Ruby, C#, PHP, and more side by side
- **Shared contracts** — TypeScript interfaces in `@devfolio/shared-interfaces` enforce one API shape across every frontend and backend
- **Real database integration** — Supabase PostgreSQL via asyncpg session pooler, with graceful seed-mode fallback
- **Polyglot architecture** — same domain logic implemented in multiple languages; shared libs maximise reuse
- **REST and GraphQL** — the query language is selectable; the same data is available via both
- **Progressive delivery** — phased roadmap with working software at every stage

---

## Current State (Phase 1 — Complete)

| Layer | Technology | Status |
|---|---|---|
| Frontend | React 19 + Vite | ✅ Live |
| Backend | FastAPI + Python 3.12 | ✅ Live |
| Database | Supabase PostgreSQL | ✅ Connected |
| Containerisation | Docker Compose | ✅ Working |
| Monorepo | pnpm + Nx | ✅ Configured |

---

## Planned Stack Coverage

### Frontends

| Framework | Language | Phase |
|---|---|---|
| React + Vite | TypeScript | ✅ Phase 1 |
| Next.js | TypeScript | Phase 3 |
| Angular | TypeScript | Phase 4 |
| Vue / Nuxt | TypeScript | Phase 5 |
| Remix | TypeScript | Phase 9 |
| Astro | TypeScript | Phase 9 |
| Qwik | TypeScript | Phase 9 |
| SvelteKit | TypeScript | Phase 10 |
| Gatsby | TypeScript | Phase 10 |
| Blazor | C# / WebAssembly | Phase 11 |
| Vanilla JS | JavaScript | Phase 12 |

### Backends

| Framework | Language | Lib | Phase |
|---|---|---|---|
| FastAPI | Python | `resume-python` | ✅ Phase 1 |
| Rails | Ruby | `resume-ruby` | Phase 2 |
| Django REST Framework | Python | `resume-django` | Phase 6 |
| Flask | Python | `resume-flask` | Phase 6 |
| Laravel | PHP | `resume-php` | Phase 7 |
| Drupal (Headless) | PHP | `resume-drupal` | Phase 7 |
| ASP.NET Core | C# | `resume-dotnet` | Phase 8 |
| Express | Node.js | `resume-node` | Phase 8 |

### Query Languages

| Type | Phase |
|---|---|
| REST | ✅ Phase 1 |
| GraphQL | Phase 3 |

### Databases

| Database | Type | Phase |
|---|---|---|
| PostgreSQL | Relational | ✅ Phase 1 |
| MySQL | Relational | Phase 8 |
| SQLite | Relational | Phase 8 |
| SQL Server (MSSQL) | Relational | Phase 8 |
| MongoDB | Document | Phase 8 |
| Redis | Key-Value | Phase 11 |
| CockroachDB | Distributed SQL | Phase 12 |

---

## Quick Start

### Prerequisites

- Docker Desktop (or Docker Engine + Compose)
- Node.js 20+ and pnpm
- A `.env` file at the workspace root (see below)

### Environment

Create `.env` in the project root:

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-us-west-2.pooler.supabase.com:5432/postgres
```

> Use the **session pooler** URL from Supabase Dashboard → Settings → Database → Connection pooling (port 5432).

### Run

```bash
# Install Node dependencies
pnpm install

# Start all services
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Seed the Database

The API seeds automatically on startup when `DATABASE_URL` is set. To seed manually:

```bash
python3 libs/backend/resume-python/devfolio_resume_python/seeder.py
```

---

## Project Structure

```
devfolio/
├── apps/
│   ├── web-react/          # React + Vite frontend (Phase 1)
│   ├── web-next/           # Next.js frontend (Phase 3)
│   ├── web-angular/        # Angular frontend (Phase 4)
│   ├── web-vue/            # Vue/Nuxt frontend (Phase 5)
│   ├── web-remix/          # Remix frontend (Phase 9)
│   ├── web-astro/          # Astro frontend (Phase 9)
│   ├── web-qwik/           # Qwik frontend (Phase 9)
│   ├── web-svelte/         # SvelteKit frontend (Phase 10)
│   ├── web-gatsby/         # Gatsby frontend (Phase 10)
│   ├── web-blazor/         # Blazor WebAssembly frontend (Phase 11)
│   ├── api-python/         # FastAPI backend (Phase 1)
│   ├── api-ruby/           # Rails backend (Phase 2)
│   ├── api-django/         # Django REST Framework (Phase 6)
│   ├── api-flask/          # Flask backend (Phase 6)
│   ├── api-php/            # Laravel + Drupal (Phase 7)
│   ├── api-dotnet/         # ASP.NET Core (Phase 8)
│   ├── api-node/           # Express (Phase 8)
│   └── api-gateway/        # GraphQL gateway (Phase 3)
├── libs/
│   ├── shared/
│   │   ├── interfaces/     # TypeScript contracts — shared by all frontends
│   │   └── models/         # Seed data models
│   ├── frontend/
│   │   ├── shared-hooks/   # React hooks (useFetch)
│   │   ├── resume-react/   # React resume components
│   │   ├── resume-angular/ # Angular resume components
│   │   └── resume-vue/     # Vue resume components
│   └── backend/
│       ├── resume-python/  # Python domain logic — FastAPI (Phase 1)
│       ├── resume-ruby/    # Ruby domain logic — Rails (Phase 2)
│       ├── resume-dotnet/  # C# domain logic — ASP.NET Core (Phase 8)
│       └── resume-php/     # PHP domain logic — Laravel/Drupal (Phase 7)
└── docs/                   # Project documentation
```

---

## Documentation

| Document | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Tech decisions, data flow, monorepo structure |
| [ROADMAP.md](docs/ROADMAP.md) | Phased delivery plan and current status |
| [STACK-SELECTOR.md](docs/STACK-SELECTOR.md) | Dashboard design and stack switching |
| [TESTING.md](docs/TESTING.md) | Test strategy, coverage, and how to run |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Branching strategy and PR process |

---

## License

MIT

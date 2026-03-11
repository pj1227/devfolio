# Roadmap

DevFolio is built in phases. Each phase delivers working software — nothing is stubbed or mocked. The current status of each phase is tracked here.

---

## Phase 1 — Foundation ✅ Complete

**Goal:** A working full-stack portfolio with a real database, containerised and running locally.

| Chunk | Description | Status |
|---|---|---|
| 1a | Nx monorepo scaffold — apps, libs, shared interfaces, Nx config | ✅ Done |
| 1b | FastAPI backend — all resume endpoints, seed repository, TDD | ✅ Done |
| 1c | React + Vite frontend — all tabs, resume selector, tech-stack card | ✅ Done |
| 1d | Docker Compose — both services containerised | ✅ Done |
| 1e | Supabase PostgreSQL — schema, session pooler, asyncpg pool | ✅ Done |
| 1f | Seeder — idempotent upserts from resumes.json, standalone runner | ✅ Done |
| 1g | Component refactor — app.tsx split, shared-hooks lib, shared-interfaces wired | ✅ Done |

---

## Phase 2 — Rails Backend 🔜 Next

**Goal:** Same API contract in Ruby on Rails. Stack selector dashboard introduced.

| Chunk | Description | Status |
|---|---|---|
| 2a | Rails API scaffold in `apps/api-ruby` | Planned |
| 2b | `libs/backend/resume-ruby` — domain logic, repository pattern | Planned |
| 2c | All endpoints — same contract as FastAPI | Planned |
| 2d | PostgreSQL via ActiveRecord | Planned |
| 2e | Stack selector dashboard — choose backend, see live response | Planned |
| 2f | Docker Compose updated — Rails service added | Planned |

---

## Phase 3 — Next.js Frontend + GraphQL

**Goal:** Next.js portfolio implementation. GraphQL layer introduced alongside REST.

| Chunk | Description | Status |
|---|---|---|
| 3a | Next.js app scaffold in `apps/web-next` | Planned |
| 3b | Extract shared React components to `libs/frontend/resume-react` | Planned |
| 3c | All tabs — App Router, SSR profile, dynamic tech-stack | Planned |
| 3d | GraphQL gateway in `apps/api-gateway` (Strawberry / Python) | Planned |
| 3e | GraphQL schema mirrors REST contract | Planned |
| 3f | Stack selector gains query language toggle — REST vs GraphQL | Planned |
| 3g | Stack selector updated — Next.js frontend option unlocked | Planned |

---

## Phase 4 — Angular Frontend

**Goal:** Angular implementation. `libs/frontend/resume-angular` provides shared components.

| Chunk | Description | Status |
|---|---|---|
| 4a | Angular app scaffold in `apps/web-angular` | Planned |
| 4b | Angular resume components in `libs/frontend/resume-angular` | Planned |
| 4c | All tabs implemented using Angular HttpClient | Planned |
| 4d | Stack selector updated — Angular option unlocked | Planned |

---

## Phase 5 — Vue / Nuxt Frontend

**Goal:** Vue 3 + Nuxt implementation. `libs/frontend/resume-vue` provides shared components.

| Chunk | Description | Status |
|---|---|---|
| 5a | Nuxt app scaffold in `apps/web-vue` | Planned |
| 5b | Vue resume components in `libs/frontend/resume-vue` | Planned |
| 5c | All tabs implemented | Planned |
| 5d | Stack selector updated — Vue/Nuxt option unlocked | Planned |

---

## Phase 6 — Django REST Framework + Flask

**Goal:** Two more Python backends demonstrating the contract across Django and Flask conventions.

| Chunk | Description | Status |
|---|---|---|
| 6a | Django REST Framework scaffold in `apps/api-django` | Planned |
| 6b | `libs/backend/resume-django` — DRF serializers aligned to shared interfaces | Planned |
| 6c | Flask scaffold in `apps/api-flask` | Planned |
| 6d | `libs/backend/resume-flask` — Flask blueprints and service layer | Planned |
| 6e | Both backends fully tested | Planned |
| 6f | Stack selector updated — Django and Flask options unlocked | Planned |

---

## Phase 7 — Laravel + Drupal (Headless PHP)

**Goal:** PHP backends. Laravel as a conventional API; Drupal as a headless CMS via JSON:API.

| Chunk | Description | Status |
|---|---|---|
| 7a | Laravel API scaffold in `apps/api-php` | Planned |
| 7b | `libs/backend/resume-php` — Eloquent-based domain logic | Planned |
| 7c | All endpoints implemented | Planned |
| 7d | Drupal headless setup — JSON:API module wired to resume data | Planned |
| 7e | Stack selector updated — Laravel and Drupal options unlocked | Planned |

---

## Phase 8 — ASP.NET Core + Express + Additional Databases

**Goal:** C# and Node.js backends. All remaining SQL and NoSQL databases added.

| Chunk | Description | Status |
|---|---|---|
| 8a | ASP.NET Core scaffold in `apps/api-dotnet` | Planned |
| 8b | `libs/backend/resume-dotnet` — C# domain logic, repository pattern | Planned |
| 8c | All endpoints implemented — mirrors FastAPI contract | Planned |
| 8d | Express scaffold in `apps/api-node` | Planned |
| 8e | MySQL database support | Planned |
| 8f | SQLite database support | Planned |
| 8g | SQL Server (MSSQL) database support | Planned |
| 8h | MongoDB database support | Planned |
| 8i | Stack selector updated — all new options unlocked | Planned |

---

## Phase 9 — Remix + Astro + Qwik

**Goal:** Three modern frontend frameworks demonstrating different rendering and performance models.

| Chunk | Description | Status |
|---|---|---|
| 9a | Remix scaffold in `apps/web-remix` — nested routing, loaders/actions | Planned |
| 9b | Astro scaffold in `apps/web-astro` — islands architecture, partial hydration | Planned |
| 9c | Qwik scaffold in `apps/web-qwik` — resumability, zero hydration cost | Planned |
| 9d | Stack selector updated — all three options unlocked | Planned |

---

## Phase 10 — SvelteKit + Gatsby

| Chunk | Description | Status |
|---|---|---|
| 10a | SvelteKit scaffold in `apps/web-svelte` | Planned |
| 10b | Gatsby scaffold in `apps/web-gatsby` — static generation + incremental builds | Planned |
| 10c | Stack selector updated | Planned |

---

## Phase 11 — Blazor + Redis

**Goal:** The only non-JavaScript frontend — Blazor WebAssembly running C# in the browser. Redis caching layer added.

| Chunk | Description | Status |
|---|---|---|
| 11a | Blazor WebAssembly scaffold in `apps/web-blazor` | Planned |
| 11b | All tabs implemented in C# / Razor components | Planned |
| 11c | Shares `resume-dotnet` domain types with ASP.NET Core backend | Planned |
| 11d | Redis caching layer — optional cache between API and database | Planned |
| 11e | Stack selector updated — Blazor option unlocked | Planned |

---

## Phase 12 — Vanilla JS + CockroachDB

| Chunk | Description | Status |
|---|---|---|
| 12a | Vanilla JS frontend — no framework, plain fetch API | Planned |
| 12b | CockroachDB as a distributed SQL alternative | Planned |
| 12c | Stack selector updated | Planned |

---

## Hosting Plan

| Component | Provider | Notes |
|---|---|---|
| Main site / dashboard | Railway or Vercel | Custom domain via Namecheap |
| React / Next.js frontends | Vercel | Free tier, native Next.js support |
| Python backends | Railway | ~$5/month, no cold starts |
| Ruby / PHP / Node backends | Railway | Same service |
| ASP.NET Core | Azure App Service | Free tier available |
| Blazor | Azure Static Web Apps | Native Blazor hosting, free tier |
| Database | Supabase | Free tier (already live) |
| MySQL | PlanetScale | Free tier |
| MongoDB | MongoDB Atlas | Free tier |

---

## Guiding Principles

1. Working software at the end of every chunk — no "almost done" states committed to staging
2. Feature branches off staging, PR back in when complete
3. The `/tech-stack` endpoint must return live runtime data — no hardcoded values
4. Shared interfaces are updated before implementation begins — contract first
5. Tests written before or alongside implementation — never after

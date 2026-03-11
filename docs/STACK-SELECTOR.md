# Stack Selector

## What It Is

The Stack Selector is the dashboard that makes DevFolio different from a standard portfolio site.

It is a control panel — rendered at the top of every page — that lets any visitor choose which frontend framework, backend language, query language, and database they want to see serving the portfolio in real time. The page re-renders immediately using the selected combination. The `/tech-stack` tab updates to reflect the live runtime of whichever backend responded.

This is not a theme switcher. Every combination is a genuinely different codebase running on a genuinely different server. The same schema, the same data contract, the same visual design — implemented independently in each language and framework.

---

## Why It Exists

Most developer portfolios list technologies. This one runs them.

A prospective employer or client can select the stack they care about — Rails, FastAPI, ASP.NET Core, GraphQL — and see it respond live. The tech-stack card shows the exact runtime version, framework version, and database connection status reported by that backend. The query language toggle switches between REST and GraphQL without changing the rendered output — only the wire format changes.

Options not yet implemented show as "Coming Soon — Phase N" rather than being hidden. The roadmap is visible.

---

## Design

### Layout

The selector sits in a persistent header bar above the main content, divided into four segments:

```
[ Frontend ]    [ Backend ]    [ Query ]    [ Database ]
  React    ▾     FastAPI  ▾     REST   ▾    PostgreSQL ▾
```

Selecting any option triggers an immediate data refresh using the new combination.

### Option States

| State | Appearance | Behaviour |
|---|---|---|
| Available | Full colour, clickable | Switches to that stack immediately |
| Coming Soon | Muted, phase badge | Tooltip: "Arriving in Phase N" |
| Active | Highlighted border | Currently selected |

### URL Encoding

Every selection is encoded in the URL query string:

```
https://devfolio.dev/?frontend=react&backend=fastapi&query=rest&db=postgres
```

This makes every stack combination a shareable, bookmarkable link.

---

## Frontend Options

| Value | Label | Language | Phase | Available |
|---|---|---|---|---|
| `react` | React + Vite | TypeScript | 1 | ✅ Yes |
| `next` | Next.js | TypeScript | 3 | 🔜 Planned |
| `angular` | Angular | TypeScript | 4 | 🔜 Planned |
| `nuxt` | Vue / Nuxt | TypeScript | 5 | 🔜 Planned |
| `remix` | Remix | TypeScript | 9 | 🔜 Planned |
| `astro` | Astro | TypeScript | 9 | 🔜 Planned |
| `qwik` | Qwik | TypeScript | 9 | 🔜 Planned |
| `svelte` | SvelteKit | TypeScript | 10 | 🔜 Planned |
| `gatsby` | Gatsby | TypeScript | 10 | 🔜 Planned |
| `blazor` | Blazor WebAssembly | C# | 11 | 🔜 Planned |
| `vanilla` | Vanilla JS | JavaScript | 12 | 🔜 Planned |

> **Note on Blazor:** The only non-JavaScript frontend. Blazor runs C# directly in the browser via WebAssembly, sharing domain types with the ASP.NET Core backend via `libs/backend/resume-dotnet`. This is the most direct demonstration of the monorepo's polyglot capabilities.

---

## Backend Options

| Value | Label | Language | Lib | Phase | Available |
|---|---|---|---|---|---|
| `fastapi` | FastAPI | Python | `resume-python` | 1 | ✅ Yes |
| `rails` | Rails | Ruby | `resume-ruby` | 2 | 🔜 Planned |
| `django` | Django REST | Python | `resume-django` | 6 | 🔜 Planned |
| `flask` | Flask | Python | `resume-flask` | 6 | 🔜 Planned |
| `laravel` | Laravel | PHP | `resume-php` | 7 | 🔜 Planned |
| `drupal` | Drupal | PHP | `resume-drupal` | 7 | 🔜 Planned |
| `aspnet` | ASP.NET Core | C# | `resume-dotnet` | 8 | 🔜 Planned |
| `express` | Express | Node.js | `resume-node` | 8 | 🔜 Planned |

---

## Query Language Options

| Value | Label | Phase | Available |
|---|---|---|---|
| `rest` | REST | 1 | ✅ Yes |
| `graphql` | GraphQL | 3 | 🔜 Planned |

### GraphQL Implementation Plan

GraphQL is introduced in Phase 3 via a dedicated gateway service (`apps/api-gateway`). The gateway sits in front of existing backends and exposes a single GraphQL schema that mirrors the REST contract exactly.

Initial implementation uses **Strawberry** (Python) for the gateway — its type-first approach maps cleanly to the existing Pydantic models in `resume-python`.

```graphql
type Query {
  profile(resume: ResumeVariant!): Profile
  workExperience(resume: ResumeVariant!): [WorkExperience!]!
  education(resume: ResumeVariant!): [Education!]!
  skills(resume: ResumeVariant!): [SkillCategory!]!
  projects: [Project!]!
  techStack: TechStackInfo!
}

enum ResumeVariant {
  FULLSTACK
  DOTNET
}
```

The frontend query language toggle switches the client between:
- `useResumeApi` (REST) — existing hook
- `useResumeGql` (GraphQL) — new hook using a lightweight GraphQL client

The rendered output is identical regardless of which query language is selected. Only the network tab differs.

---

## Database Options

| Value | Label | Type | Phase | Available |
|---|---|---|---|---|
| `postgres` | PostgreSQL | Relational | 1 | ✅ Yes |
| `mysql` | MySQL | Relational | 8 | 🔜 Planned |
| `sqlite` | SQLite | Relational | 8 | 🔜 Planned |
| `mssql` | SQL Server | Relational | 8 | 🔜 Planned |
| `mongodb` | MongoDB | Document | 8 | 🔜 Planned |
| `redis` | Redis | Key-Value | 11 | 🔜 Planned |
| `cockroachdb` | CockroachDB | Distributed SQL | 12 | 🔜 Planned |

---

## Data Model

Options are defined in `@devfolio/shared-interfaces`:

```typescript
interface StackOption<T extends string> {
  value: T;
  label: string;       // "Next.js", "FastAPI", "PostgreSQL"
  version: string;     // "15.x", "0.115.x", "17.x"
  language: string;    // "TypeScript", "Python", "C#"
  phase: number;
  available: boolean;
  apiBaseUrl?: string; // only set when available === true
}

interface StackSelection {
  frontend: FrontendStack;
  backend: BackendStack;
  query: QueryLanguage;   // 'rest' | 'graphql'
  database: DatabaseStack;
}
```

Adding a new stack means adding an entry to `libs/shared/models/src/index.ts` and flipping `available: true` — no other changes required.

---

## Phase 2 Implementation (First Version)

The selector UI debuts in Phase 2 with two real backend options — FastAPI and Rails — giving visitors a genuine choice from day one:

1. Selector component built in `libs/frontend/shared-ui`
2. React wrapper in `apps/web-react` consuming the selector state
3. `StackSelection` persisted in URL query params
4. `useResumeApi` reads `apiBaseUrl` from the active backend option
5. Performance panel shows `meta.durationMs` side by side for all available backends

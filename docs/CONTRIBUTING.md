# Contributing

## Branch Strategy

```
main
 └── staging
       └── feature/*
       └── fix/*
       └── chore/*
```

### main

Production-ready code. Represents the live deployed state. Direct commits to `main` are not permitted after Phase 1.

Phase 1 was developed directly on `main` to establish the foundation quickly. All subsequent work flows through `staging`.

### staging

Integration branch. All feature branches are created from `staging` and merged back into `staging` via pull request. `staging` is merged to `main` when a phase or significant milestone is complete and verified.

### Feature branches

Every piece of work — no matter how small — gets its own branch.

```bash
# Create a feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/rails-backend
```

Branch naming conventions:

| Prefix | Use for |
|---|---|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `chore/` | Maintenance, deps, config |
| `refactor/` | Structural changes with no behaviour change |
| `docs/` | Documentation only |

---

## Workflow

### Starting a new chunk

1. Check out `staging` and pull latest
2. Create a branch: `git checkout -b feature/description`
3. Work in small, focused commits
4. Push the branch: `git push origin feature/description`
5. Open a PR into `staging`
6. Verify locally that the full app still works
7. Merge and delete the branch

### Commit messages

Follow conventional commits:

```
feat(api-ruby): add /profile endpoint
fix(web-react): resolve CORS error on tech-stack fetch
chore(deps): update asyncpg to 0.30.0
refactor(resume-python): extract seeder __main__ block
docs: add ARCHITECTURE.md
```

Format: `type(scope): short description`

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `build`

Scope is the app or lib name: `web-react`, `api-python`, `resume-python`, `shared-interfaces`, etc.

---

## Before Every Commit

```bash
# Typecheck
npx nx typecheck web-react

# Lint
npx nx lint web-react

# Tests
npx nx test resume-python

# Build
npx nx build web-react
```

All four must pass cleanly before pushing.

---

## Adding a New Backend

1. Create a feature branch: `feature/api-<language>`
2. Scaffold the app: `apps/api-<language>/`
3. Scaffold the lib: `libs/backend/resume-<language>/`
4. Implement all endpoints from the contract in `@devfolio/shared-interfaces`
5. Add a `SeedRepository` equivalent for that language
6. Write tests — all routes, all resume variants
7. Add the service to `docker-compose.yml`
8. Update `ROADMAP.md` — mark the chunks complete
9. Update `apps/web-react/src/components/layout/Header.tsx` — add the new backend label
10. PR into staging

## Adding a New Frontend

1. Create a feature branch: `feature/web-<framework>`
2. Scaffold the app: `apps/web-<framework>/`
3. Extract any reusable components to `libs/frontend/resume-<framework>/`
4. Wire all data fetching to `@devfolio/shared-interfaces` types
5. Implement all tabs matching the existing React implementation
6. Add the service to `docker-compose.yml`
7. Update `ROADMAP.md`
8. PR into staging

---

## Environment Setup

```bash
# Clone
git clone https://github.com/pj1227/devfolio.git
cd devfolio

# Install Node dependencies
pnpm install

# Create .env (see README for format)
cp .env.example .env
# Edit .env with your Supabase session pooler URL

# Start everything
docker compose up --build
```

---

## Code Style

### TypeScript

- All types imported from `@devfolio/shared-interfaces`
- No inline type definitions that duplicate shared interfaces
- Hooks live in `libs/frontend/shared-hooks` (generic) or `apps/*/src/hooks` (app-specific)
- Components are named exports, not default exports (except the app root)

### Python

- `ruff` for linting and formatting (configured in `pyproject.toml`)
- `pydantic` for all data models
- Repository pattern — no direct database calls outside `*_repository.py`
- Type hints on all function signatures

### General

- No commented-out code committed
- No hardcoded values in the tech-stack endpoint — everything must come from runtime introspection
- Every new endpoint must have a corresponding test

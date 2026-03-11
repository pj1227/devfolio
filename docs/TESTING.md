# Testing

## Philosophy

Tests are written before or alongside implementation — never after the fact. The test suite is the first consumer of every public interface, which means it catches design problems before they become structural debt.

The repository pattern is the key enabler. `SeedRepository` provides deterministic, database-free test data. Every unit and integration test runs against it. The real database is never touched by CI.

---

## Test Stack

| Layer | Tool | Location |
|---|---|---|
| Python unit tests | pytest + pytest-asyncio | `libs/backend/resume-python/tests/` |
| Python API tests | pytest + httpx | `apps/api-python/tests/` |
| TypeScript unit tests | Vitest | `libs/shared/interfaces/src/__tests__/` |
| End-to-end | Playwright | `apps/web-react-e2e/` |

---

## Running Tests

### All tests

```bash
npx nx run-many --target=test --all
```

### Python only

```bash
# Unit tests for the resume-python lib
npx nx test resume-python

# API route tests
npx nx test api-python
```

### TypeScript only

```bash
# Shared interfaces
npx nx test shared-interfaces

# All frontend libs
npx nx run-many --target=test --projects=shared-interfaces,shared-hooks
```

### End-to-end

```bash
# Requires docker compose up first
npx nx e2e web-react-e2e
```

### With coverage

```bash
npx nx test resume-python --coverage
```

Coverage reports are written to:
- HTML: `coverage/libs/backend/resume-python/html/`
- XML: `coverage/libs/backend/resume-python/coverage.xml`

---

## Python Test Structure

```
libs/backend/resume-python/tests/
├── conftest.py          # Shared fixtures — SeedRepository, ResumeService
├── test_models.py       # Pydantic model validation
├── test_repository.py   # SeedRepository behaviour
├── test_service.py      # ResumeService logic
└── test_runtime.py      # Tech-stack introspection

apps/api-python/tests/
├── conftest.py          # TestClient fixture
└── test_routes.py       # All endpoint contracts
```

### Key Fixtures

```python
# conftest.py
@pytest.fixture
def repo() -> SeedRepository:
    return SeedRepository()

@pytest.fixture
def service(repo) -> ResumeService:
    return ResumeService(repo)
```

Tests never instantiate `PostgresRepository` directly. The repository pattern means `ResumeService` is fully testable without a database.

---

## TypeScript Test Structure

```
libs/shared/interfaces/src/__tests__/
└── interfaces.test.ts   # Type guard validators (isProfile, isTechStackInfo, etc.)

libs/shared/models/src/__tests__/
└── seed.test.ts         # Seed data shape validation
```

---

## What Is Tested

### Python

- All Pydantic models validate correctly
- `SeedRepository` returns expected data shapes for both resume variants
- `ResumeService` applies correct business logic (variant filtering, skill enrichment)
- All API routes return 200 with correct response envelope
- `tech-stack` endpoint returns live runtime data with `connected` boolean
- Seed fallback behaviour when `DATABASE_URL` is absent

### TypeScript

- All type guards (`isProfile`, `isWorkExperience`, `isTechStackInfo`) correctly validate conforming and non-conforming data
- Seed model data satisfies all interface constraints

### End-to-End

- Frontend loads and displays profile data
- Resume selector switches between `fullstack` and `.NET` variants
- All five tabs render without errors
- Tech-stack card shows correct connected status

---

## CI Strategy

All tests run on every push to any branch. The pipeline:

1. `pnpm install`
2. `npx nx run-many --target=lint --all`
3. `npx nx run-many --target=typecheck --all`
4. `npx nx run-many --target=test --all`
5. `npx nx run-many --target=build --all`

The database is never required in CI. `DATABASE_URL` is intentionally absent — all tests use `SeedRepository`.

End-to-end tests run separately on merge to `staging`, with Docker Compose spun up as a service.

---

## Adding Tests for New Stacks

When a new backend is added (Rails, Django, etc.), the same test contract applies:

1. A repository equivalent of `SeedRepository` must exist for that language
2. All endpoints must be covered by route tests using that seed repository
3. The `/tech-stack` endpoint must return a response that satisfies `isTechStackInfo`
4. Tests must pass without a live database

The shared `validators.ts` type guards serve as the cross-language acceptance criteria. If the response passes `isTechStackInfo`, the implementation is correct.

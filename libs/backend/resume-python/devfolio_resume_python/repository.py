"""
libs/backend/resume-python/src/repository.py
Repository Protocol (interface) and in-memory SeedRepository.

IResumeRepository is a Protocol — Python's equivalent of a TypeScript
interface. Any class implementing all these methods satisfies it,
whether it talks to Postgres, MySQL, or in-memory data.

SeedRepository reads from resumes.json — the single source of truth
for all resume variant data. Projects stay hardcoded here as they are
portfolio-specific, not resume-derived.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Protocol, runtime_checkable

from .models import (
    Education,
    Profile,
    ProficiencyLevel,
    Project,
    ProjectCategory,
    Skill,
    SkillCategory,
    WorkExperience,
)

# ── JSON loading ──────────────────────────────────────────────────────────────

def _data_path() -> Path:
    """Resolve path to resumes.json relative to this file."""
    return Path(__file__).parent.parent / 'data' / 'resumes.json'


@lru_cache(maxsize=1)
def _load_resume_data() -> dict:
    """Load and cache resumes.json. Called once per process."""
    path = _data_path()
    if not path.exists():
        raise FileNotFoundError(f'resumes.json not found at {path}')
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


# ── Proficiency enrichment ────────────────────────────────────────────────────

# Maps skill names (lowercased) to (proficiency, years_of_experience, highlighted)
# JSON carries category/order; this carries the richer metadata.
_SKILL_META: dict[str, tuple[ProficiencyLevel, int | None, bool]] = {
    # Frontend
    'angular':              (ProficiencyLevel.expert,       10, True),
    'react':                (ProficiencyLevel.advanced,      3, True),
    'vue/nuxt':             (ProficiencyLevel.advanced,      2, False),
    'typescript':           (ProficiencyLevel.expert,        8, True),
    'javascript':           (ProficiencyLevel.expert,       12, False),
    'html':                 (ProficiencyLevel.expert,       15, False),
    'css':                  (ProficiencyLevel.expert,       15, False),
    # Backend
    'c#':                   (ProficiencyLevel.expert,       10, True),
    '.net':                 (ProficiencyLevel.expert,       10, True),
    '.net core':            (ProficiencyLevel.expert,       10, True),
    'restful apis & internal service endpoints': (ProficiencyLevel.expert, 10, False),
    'wcf':                  (ProficiencyLevel.advanced,      6, False),
    'wpf':                  (ProficiencyLevel.advanced,      4, False),
    'xaml':                 (ProficiencyLevel.advanced,      4, False),
    'wcp':                  (ProficiencyLevel.advanced,      4, False),
    'internal apis & service endpoints': (ProficiencyLevel.expert, 10, False),
    # Architecture
    'full stack application architecture': (ProficiencyLevel.expert, 10, False),
    'mvc':                  (ProficiencyLevel.expert,       10, False),
    'mvvm':                 (ProficiencyLevel.expert,       10, False),
    'client-server architectures': (ProficiencyLevel.expert, 10, False),
    'client-server architecture':  (ProficiencyLevel.expert, 10, False),
    'component-based ui design':   (ProficiencyLevel.expert,  8, False),
    # Data
    'sql server':           (ProficiencyLevel.expert,       10, True),
    'entity framework':     (ProficiencyLevel.expert,        8, False),
    'relational database design':  (ProficiencyLevel.expert, 10, False),
    'stored procedures & functions': (ProficiencyLevel.expert, 10, False),
    # Testing
    'unit testing':         (ProficiencyLevel.expert,        8, False),
    'test-driven development (tdd)': (ProficiencyLevel.advanced, 5, False),
    'code reviews':         (ProficiencyLevel.expert,        8, False),
    # Tools
    'visual studio':        (ProficiencyLevel.expert,       12, False),
    'visual studio code':   (ProficiencyLevel.expert,        8, False),
    'git':                  (ProficiencyLevel.expert,       10, False),
    'github':               (ProficiencyLevel.expert,       10, False),
    'bitbucket':            (ProficiencyLevel.advanced,      6, False),
    'jira':                 (ProficiencyLevel.advanced,      8, False),
    'confluence':           (ProficiencyLevel.advanced,      8, False),
    # Additional
    'ai-assisted development workflows (aidd)': (ProficiencyLevel.advanced, 2, True),
}


def _enrich_skill(name: str, note: str | None = None) -> Skill:
    """Look up proficiency metadata for a skill by name."""
    key = name.lower()
    proficiency, years, highlighted = _SKILL_META.get(
        key, (ProficiencyLevel.intermediate, None, False)
    )
    display_name = f'{name} ({note})' if note else name
    return Skill(
        name=display_name,
        proficiency=proficiency,
        years_of_experience=years,
        highlighted=highlighted,
    )


# ── Protocol ──────────────────────────────────────────────────────────────────

DEFAULT_RESUME = 'fullstack'
VALID_RESUMES  = ('fullstack', 'dotnet')


@runtime_checkable
class IResumeRepository(Protocol):
    async def find_profile(self, resume: str = DEFAULT_RESUME) -> Profile: ...
    async def find_work_experience(self, resume: str = DEFAULT_RESUME) -> list[WorkExperience]: ...
    async def find_education(self, resume: str = DEFAULT_RESUME) -> list[Education]: ...
    async def find_skills(self, resume: str = DEFAULT_RESUME) -> list[SkillCategory]: ...
    async def find_projects(self, resume: str = DEFAULT_RESUME) -> list[Project]: ...
    async def get_database_version(self) -> str: ...
    async def get_database_name(self) -> str: ...


# ── SeedRepository ────────────────────────────────────────────────────────────

class SeedRepository:
    """
    In-memory repository backed by resumes.json.

    Resolves the correct resume variant by merging base data with the
    requested variant's overrides. Falls back to DEFAULT_RESUME if an
    unknown variant is requested.
    """

    def _data(self) -> dict:
        return _load_resume_data()

    def _variant(self, resume: str) -> dict:
        data = self._data()
        if resume not in VALID_RESUMES:
            resume = DEFAULT_RESUME
        return data['resumes'][resume]

    # ── Profile ───────────────────────────────────────────────────────────────

    async def find_profile(self, resume: str = DEFAULT_RESUME) -> Profile:
        base    = self._data()['base']['profile']
        variant = self._variant(resume).get('profile', {})

        # Variant overrides base for summary and title only
        return Profile(
            name      = base['name'],
            title     = base['title'],
            clearance = base['clearance'],
            summary   = variant.get('summary', ''),
            email     = base['email'],
            location  = base['location'],
            github    = base['github'],
            linkedin  = base['linkedin'],
        )

    # ── Work Experience ───────────────────────────────────────────────────────

    async def find_work_experience(self, resume: str = DEFAULT_RESUME) -> list[WorkExperience]:
        base_entries = self._data()['base']['workExperience']
        highlights   = self._variant(resume).get('highlights', {})
        base_hl      = self._data()['base']

        result: list[WorkExperience] = []

        for entry in base_entries:
            company  = entry['company']
            location = entry['location']

            for role in entry['roles']:
                role_id    = role['id']
                role_title = role['title']

                # Resolve highlights: variant override → base highlights → empty
                if role_id in highlights:
                    role_highlights = highlights[role_id]
                else:
                    # Check base highlights (DTE, MCI, USAF)
                    base_entry_hl = entry.get('highlights', {}).get('base', {})
                    role_highlights = base_entry_hl.get(role_id, [])

                result.append(WorkExperience(
                    id         = role_id,
                    company    = company,
                    title      = role_title,
                    location   = location,
                    start_date = role['startDate'],
                    end_date   = role.get('endDate'),
                    current    = role.get('endDate') is None,
                    summary    = '',
                    highlights = role_highlights,
                    technologies = [],
                ))

        return result

    # ── Education ─────────────────────────────────────────────────────────────

    async def find_education(self, resume: str = DEFAULT_RESUME) -> list[Education]:
        """Education is identical across all resume variants."""
        entries = self._data()['base']['education']
        return [
            Education(
                id          = e['id'],
                institution = e['institution'],
                degree      = e['degree'],
                field       = e['field'],
                start_date  = e['startDate'],
                end_date    = e.get('endDate'),
                current     = e.get('endDate') is None,
            )
            for e in entries
        ]

    # ── Skills ────────────────────────────────────────────────────────────────

    async def find_skills(self, resume: str = DEFAULT_RESUME) -> list[SkillCategory]:
        categories = self._variant(resume).get('skills', [])
        result: list[SkillCategory] = []

        for cat in categories:
            skills = [
                _enrich_skill(s['name'], s.get('note'))
                for s in cat['skills']
            ]
            result.append(SkillCategory(category=cat['category'], skills=skills))

        return result

    # ── Projects ──────────────────────────────────────────────────────────────

    async def find_projects(self, resume: str = DEFAULT_RESUME) -> list[Project]:
        """Projects are portfolio-specific — not resume-variant-dependent."""
        return [
            Project(
                id='proj-001',
                name='DevFolio',
                description='This portfolio — a polyglot full stack architecture demo',
                summary=(
                    'A developer portfolio serving the same resume data from multiple '
                    'frontend frameworks and backend languages. Shared TypeScript '
                    'interfaces enforce one contract across every implementation.'
                ),
                technologies=['Next.js', 'React', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL'],
                github_url='https://github.com/pj1227/devfolio',
                featured=True,
                start_date='2025-08',
                current=True,
                highlights=[
                    'Shared TypeScript interfaces enforce one contract across 3 frontends and 4 backends',
                    'Live /api/tech-stack endpoint proves each implementation is real',
                    'TDD from the start — tests written before implementation',
                ],
                category=ProjectCategory.web,
            ),
            Project(
                id='proj-002',
                name='WPF Weather or Not',
                description='WPF desktop weather app in C# / .NET',
                summary='A WPF desktop application demonstrating MVVM patterns with live weather data.',
                technologies=['C#', '.NET', 'WPF', 'XAML', 'MVVM'],
                github_url='https://github.com/pj1227/WPF-Weather-or-Not',
                featured=True,
                start_date='2025-08',
                current=False,
                highlights=[
                    'MVVM architecture with clean separation of concerns',
                    'Live weather API integration via C# HttpClient',
                ],
                category=ProjectCategory.other,
            ),
        ]

    # ── DB introspection (seed mode) ──────────────────────────────────────────

    async def get_database_version(self) -> str:
        return 'None (seed mode — no database connected)'

    async def get_database_name(self) -> str:
        return 'None (seed mode)'
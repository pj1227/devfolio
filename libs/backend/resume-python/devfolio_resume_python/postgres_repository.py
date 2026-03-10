"""
libs/backend/resume-python/src/postgres_repository.py

PostgresRepository implements IResumeRepository using asyncpg.
Queries Supabase (or any Postgres) for resume data by variant slug.
"""
from __future__ import annotations

import asyncpg

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
from .repository import DEFAULT_RESUME


class PostgresRepository:
    """
    Postgres-backed repository. Receives a live asyncpg connection pool
    and queries the DB for all resume data.
    """

    def __init__(self, pool: asyncpg.Pool) -> None:
        self._pool = pool

    # ── Profile ───────────────────────────────────────────────────────────────

    async def find_profile(self, resume: str = DEFAULT_RESUME) -> Profile:
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(
                'SELECT * FROM profiles WHERE resume_slug = $1', resume
            )
        if not row:
            raise ValueError(f'No profile found for resume: {resume}')
        return Profile(
            name      = row['name'],
            title     = row['title'],
            clearance = row['clearance'],
            summary   = row['summary'],
            email     = row['email'],
            location  = row['location'],
            github    = row['github'],
            linkedin  = row['linkedin'],
            website   = row['website'],
            avatar_url= row['avatar_url'],
        )

    # ── Work Experience ───────────────────────────────────────────────────────

    async def find_work_experience(self, resume: str = DEFAULT_RESUME) -> list[WorkExperience]:
        async with self._pool.acquire() as conn:
            rows = await conn.fetch('''
                SELECT
                    r.slug      AS role_slug,
                    r.title     AS role_title,
                    r.start_date,
                    r.end_date,
                    r.sort_order AS role_order,
                    c.slug      AS company_slug,
                    c.name      AS company_name,
                    c.location  AS company_location,
                    c.company_url
                FROM roles r
                JOIN companies c ON c.slug = r.company_slug
                ORDER BY r.start_date DESC, r.sort_order ASC
            ''')

            # Fetch all highlights for this resume in one query
            highlight_rows = await conn.fetch('''
                SELECT role_slug, body, sort_order
                FROM highlights
                WHERE resume_slug = $1
                ORDER BY role_slug, sort_order
            ''', resume)

        # Group highlights by role_slug
        highlights: dict[str, list[str]] = {}
        for h in highlight_rows:
            highlights.setdefault(h['role_slug'], []).append(h['body'])

        return [
            WorkExperience(
                id           = row['role_slug'],
                company      = row['company_name'],
                title        = row['role_title'],
                location     = row['company_location'],
                start_date   = row['start_date'],
                end_date     = row['end_date'],
                current      = row['end_date'] is None,
                summary      = '',
                highlights   = highlights.get(row['role_slug'], []),
                technologies = [],
                company_url  = row['company_url'],
            )
            for row in rows
        ]

    # ── Education ─────────────────────────────────────────────────────────────

    async def find_education(self, resume: str = DEFAULT_RESUME) -> list[Education]:
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(
                'SELECT * FROM education ORDER BY sort_order ASC'
            )
        return [
            Education(
                id          = row['slug'],
                institution = row['institution'],
                degree      = row['degree'],
                field       = row['field'],
                start_date  = row['start_date'],
                end_date    = row['end_date'],
                current     = row['end_date'] is None,
            )
            for row in rows
        ]

    # ── Skills ────────────────────────────────────────────────────────────────

    async def find_skills(self, resume: str = DEFAULT_RESUME) -> list[SkillCategory]:
        async with self._pool.acquire() as conn:
            cat_rows = await conn.fetch('''
                SELECT id, name FROM skill_categories
                WHERE resume_slug = $1
                ORDER BY sort_order ASC
            ''', resume)

            skill_rows = await conn.fetch('''
                SELECT s.*
                FROM skills s
                JOIN skill_categories sc ON sc.id = s.category_id
                WHERE sc.resume_slug = $1
                ORDER BY s.category_id, s.sort_order ASC
            ''', resume)

        # Group skills by category_id
        skills_by_cat: dict[int, list[Skill]] = {}
        for s in skill_rows:
            skill = Skill(
                name                = s['name'],
                proficiency         = ProficiencyLevel(s['proficiency']),
                years_of_experience = s['years_of_experience'],
                highlighted         = s['highlighted'],
            )
            skills_by_cat.setdefault(s['category_id'], []).append(skill)

        return [
            SkillCategory(
                category = cat['name'],
                skills   = skills_by_cat.get(cat['id'], []),
            )
            for cat in cat_rows
        ]

    # ── Projects ──────────────────────────────────────────────────────────────

    async def find_projects(self, resume: str = DEFAULT_RESUME) -> list[Project]:
        async with self._pool.acquire() as conn:
            proj_rows = await conn.fetch(
                'SELECT * FROM projects ORDER BY sort_order ASC'
            )
            tech_rows = await conn.fetch(
                'SELECT * FROM project_technologies ORDER BY project_slug, sort_order ASC'
            )
            hl_rows = await conn.fetch(
                'SELECT * FROM project_highlights ORDER BY project_slug, sort_order ASC'
            )

        techs: dict[str, list[str]] = {}
        for t in tech_rows:
            techs.setdefault(t['project_slug'], []).append(t['name'])

        highlights: dict[str, list[str]] = {}
        for h in hl_rows:
            highlights.setdefault(h['project_slug'], []).append(h['body'])

        return [
            Project(
                id           = row['slug'],
                name         = row['name'],
                description  = row['description'],
                summary      = row['summary'],
                technologies = techs.get(row['slug'], []),
                github_url   = row['github_url'],
                live_url     = row['live_url'],
                featured     = row['featured'],
                start_date   = row['start_date'],
                current      = row['current'],
                highlights   = highlights.get(row['slug'], []),
                category     = ProjectCategory(row['category']),
            )
            for row in proj_rows
        ]

    # ── DB introspection ──────────────────────────────────────────────────────

    async def get_database_version(self) -> str:
        async with self._pool.acquire() as conn:
            return await conn.fetchval('SELECT version()')

    async def get_database_name(self) -> str:
        async with self._pool.acquire() as conn:
            return await conn.fetchval('SELECT current_database()')

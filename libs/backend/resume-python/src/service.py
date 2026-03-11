"""
libs/backend/resume-python/src/seeder.py

Reads resumes.json and upserts all data into Postgres.
Called on API startup when DATABASE_URL is set.
Safe to run multiple times — uses INSERT ... ON CONFLICT DO UPDATE.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path

import asyncpg

logger = logging.getLogger(__name__)

# ── Proficiency enrichment (mirrors repository.py _SKILL_META) ────────────────
_SKILL_META: dict[str, tuple[str, int | None, bool]] = {
    'angular':              ('expert',       10, True),
    'react':                ('advanced',      3, True),
    'vue/nuxt':             ('advanced',      2, False),
    'typescript':           ('expert',        8, True),
    'javascript':           ('expert',       12, False),
    'html':                 ('expert',       15, False),
    'css':                  ('expert',       15, False),
    'c#':                   ('expert',       10, True),
    '.net':                 ('expert',       10, True),
    '.net core':            ('expert',       10, True),
    'restful apis & internal service endpoints': ('expert', 10, False),
    'wcf':                  ('advanced',      6, False),
    'wpf':                  ('advanced',      4, False),
    'xaml':                 ('advanced',      4, False),
    'internal apis & service endpoints': ('expert', 10, False),
    'full stack application architecture': ('expert', 10, False),
    'mvc':                  ('expert',       10, False),
    'mvvm':                 ('expert',       10, False),
    'client-server architectures': ('expert', 10, False),
    'client-server architecture':  ('expert', 10, False),
    'component-based ui design':   ('expert',  8, False),
    'sql server':           ('expert',       10, True),
    'entity framework':     ('expert',        8, False),
    'relational database design':  ('expert', 10, False),
    'stored procedures & functions': ('expert', 10, False),
    'unit testing':         ('expert',        8, False),
    'test-driven development (tdd)': ('advanced', 5, False),
    'code reviews':         ('expert',        8, False),
    'visual studio':        ('expert',       12, False),
    'visual studio code':   ('expert',        8, False),
    'git':                  ('expert',       10, False),
    'github':               ('expert',       10, False),
    'bitbucket':            ('advanced',      6, False),
    'jira':                 ('advanced',      8, False),
    'confluence':           ('advanced',      8, False),
    'ai-assisted development workflows (aidd)': ('advanced', 2, True),
}


def _skill_meta(name: str) -> tuple[str, int | None, bool]:
    return _SKILL_META.get(name.lower(), ('intermediate', None, False))


def _data_path() -> Path:
    return Path(__file__).parent.parent / 'data' / 'resumes.json'


async def seed(conn: asyncpg.Connection) -> None:
    """Upsert all resume data from resumes.json into Postgres."""
    path = _data_path()
    if not path.exists():
        logger.error(f'resumes.json not found at {path}')
        return

    data = json.loads(path.read_text(encoding='utf-8'))
    base = data['base']
    variants = data['resumes']
    meta = data['meta']

    logger.info('Seeding resume data...')

    # ── Resumes ───────────────────────────────────────────────────────────────
    for i, slug in enumerate(meta['resumes']):
        label = {'fullstack': 'Full Stack', 'dotnet': '.NET'}.get(slug, slug)
        is_default = slug == meta.get('defaultResume', 'fullstack')
        await conn.execute('''
            INSERT INTO resumes (slug, label, is_default)
            VALUES ($1, $2, $3)
            ON CONFLICT (slug) DO UPDATE
            SET label = EXCLUDED.label, is_default = EXCLUDED.is_default
        ''', slug, label, is_default)

    # ── Profiles ──────────────────────────────────────────────────────────────
    base_profile = base['profile']
    for slug, variant in variants.items():
        vp = variant.get('profile', {})
        await conn.execute('''
            INSERT INTO profiles
                (resume_slug, name, title, clearance, summary, email,
                 location, github, linkedin)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (resume_slug) DO UPDATE SET
                name=EXCLUDED.name, title=EXCLUDED.title,
                clearance=EXCLUDED.clearance, summary=EXCLUDED.summary,
                email=EXCLUDED.email, location=EXCLUDED.location,
                github=EXCLUDED.github, linkedin=EXCLUDED.linkedin
        ''',
            slug,
            base_profile['name'],
            base_profile['title'],
            base_profile.get('clearance'),
            vp.get('summary', ''),
            base_profile['email'],
            base_profile['location'],
            base_profile.get('github'),
            base_profile.get('linkedin'),
        )

    # ── Companies + Roles + Highlights ───────────────────────────────────────
    for entry in base['workExperience']:
        company_slug = entry['id']
        await conn.execute('''
            INSERT INTO companies (slug, name, location)
            VALUES ($1, $2, $3)
            ON CONFLICT (slug) DO UPDATE
            SET name=EXCLUDED.name, location=EXCLUDED.location
        ''', company_slug, entry['company'], entry['location'])

        for role_order, role in enumerate(entry['roles']):
            role_slug = role['id']
            await conn.execute('''
                INSERT INTO roles
                    (slug, company_slug, title, start_date, end_date, sort_order)
                VALUES ($1,$2,$3,$4,$5,$6)
                ON CONFLICT (slug) DO UPDATE SET
                    title=EXCLUDED.title, start_date=EXCLUDED.start_date,
                    end_date=EXCLUDED.end_date, sort_order=EXCLUDED.sort_order
            ''',
                role_slug, company_slug,
                role['title'], role['startDate'],
                role.get('endDate'), role_order,
            )

            # Base highlights (DTE, MCI, USAF)
            base_hl = entry.get('highlights', {}).get('base', {})
            if role_slug in base_hl:
                for resume_slug in meta['resumes']:
                    await _upsert_highlights(
                        conn, role_slug, resume_slug, base_hl[role_slug]
                    )

        # Variant highlights (Independent, BigBear)
        for resume_slug, variant in variants.items():
            variant_hl = variant.get('highlights', {})
            for role in entry['roles']:
                role_slug = role['id']
                if role_slug in variant_hl:
                    await _upsert_highlights(
                        conn, role_slug, resume_slug, variant_hl[role_slug]
                    )

    # ── Education ─────────────────────────────────────────────────────────────
    for i, edu in enumerate(base['education']):
        await conn.execute('''
            INSERT INTO education
                (slug, institution, degree, field, start_date, end_date, sort_order)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT (slug) DO UPDATE SET
                institution=EXCLUDED.institution, degree=EXCLUDED.degree,
                field=EXCLUDED.field, start_date=EXCLUDED.start_date,
                end_date=EXCLUDED.end_date, sort_order=EXCLUDED.sort_order
        ''',
            edu['id'], edu['institution'], edu['degree'],
            edu['field'], edu['startDate'], edu.get('endDate'), i,
        )

    # ── Skills ────────────────────────────────────────────────────────────────
    for resume_slug, variant in variants.items():
        for cat_order, cat in enumerate(variant.get('skills', [])):
            cat_id = await conn.fetchval('''
                INSERT INTO skill_categories (resume_slug, name, sort_order)
                VALUES ($1, $2, $3)
                ON CONFLICT (resume_slug, name) DO UPDATE
                SET sort_order=EXCLUDED.sort_order
                RETURNING id
            ''', resume_slug, cat['category'], cat_order)

            await conn.execute(
                'DELETE FROM skills WHERE category_id = $1', cat_id
            )
            for skill_order, skill in enumerate(cat['skills']):
                name = skill['name']
                note = skill.get('note')
                display_name = f'{name} ({note})' if note else name
                proficiency, years, highlighted = _skill_meta(name)
                await conn.execute('''
                    INSERT INTO skills
                        (category_id, name, note, proficiency,
                         years_of_experience, highlighted, sort_order)
                    VALUES ($1,$2,$3,$4,$5,$6,$7)
                ''',
                    cat_id, display_name, note, proficiency,
                    years, highlighted, skill_order,
                )

    # ── Projects ──────────────────────────────────────────────────────────────
    projects = [
        {
            'slug': 'proj-001',
            'name': 'DevFolio',
            'description': 'This portfolio — a polyglot full stack architecture demo',
            'summary': (
                'A developer portfolio serving the same resume data from multiple '
                'frontend frameworks and backend languages.'
            ),
            'github_url': 'https://github.com/pj1227/devfolio',
            'featured': True,
            'start_date': '2025-08',
            'current': True,
            'category': 'web',
            'technologies': ['Next.js', 'React', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL'],
            'highlights': [
                'Shared TypeScript interfaces enforce one contract across 3 frontends and 4 backends',
                'Live /api/tech-stack endpoint proves each implementation is real',
                'TDD from the start — tests written before implementation',
            ],
        },
        {
            'slug': 'proj-002',
            'name': 'WPF Weather or Not',
            'description': 'WPF desktop weather app in C# / .NET',
            'summary': 'A WPF desktop application demonstrating MVVM patterns with live weather data.',
            'github_url': 'https://github.com/pj1227/WPF-Weather-or-Not',
            'featured': True,
            'start_date': '2025-08',
            'current': False,
            'category': 'other',
            'technologies': ['C#', '.NET', 'WPF', 'XAML', 'MVVM'],
            'highlights': [
                'MVVM architecture with clean separation of concerns',
                'Live weather API integration via C# HttpClient',
            ],
        },
    ]

    for i, proj in enumerate(projects):
        await conn.execute('''
            INSERT INTO projects
                (slug, name, description, summary, github_url, live_url,
                 featured, start_date, current, category, sort_order)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            ON CONFLICT (slug) DO UPDATE SET
                name=EXCLUDED.name, description=EXCLUDED.description,
                summary=EXCLUDED.summary, github_url=EXCLUDED.github_url,
                featured=EXCLUDED.featured, start_date=EXCLUDED.start_date,
                current=EXCLUDED.current, category=EXCLUDED.category
        ''',
            proj['slug'], proj['name'], proj['description'], proj['summary'],
            proj.get('github_url'), proj.get('live_url'),
            proj['featured'], proj['start_date'], proj['current'],
            proj['category'], i,
        )

        await conn.execute(
            'DELETE FROM project_technologies WHERE project_slug = $1', proj['slug']
        )
        for j, tech in enumerate(proj['technologies']):
            await conn.execute('''
                INSERT INTO project_technologies (project_slug, name, sort_order)
                VALUES ($1, $2, $3)
            ''', proj['slug'], tech, j)

        await conn.execute(
            'DELETE FROM project_highlights WHERE project_slug = $1', proj['slug']
        )
        for j, hl in enumerate(proj['highlights']):
            await conn.execute('''
                INSERT INTO project_highlights (project_slug, body, sort_order)
                VALUES ($1, $2, $3)
            ''', proj['slug'], hl, j)

    logger.info('Seeding complete ✓')


async def _upsert_highlights(
    conn: asyncpg.Connection,
    role_slug: str,
    resume_slug: str,
    highlight_list: list[str],
) -> None:
    await conn.execute(
        'DELETE FROM highlights WHERE role_slug=$1 AND resume_slug=$2',
        role_slug, resume_slug,
    )
    for i, body in enumerate(highlight_list):
        await conn.execute('''
            INSERT INTO highlights (role_slug, resume_slug, body, sort_order)
            VALUES ($1, $2, $3, $4)
        ''', role_slug, resume_slug, body, i)


if __name__ == '__main__':
    import asyncio
    import os

    from dotenv import load_dotenv

    load_dotenv()

    async def main():
        url = os.environ.get('DATABASE_URL')
        if not url:
            raise RuntimeError('DATABASE_URL is not set')
        logging.basicConfig(level=logging.INFO)
        conn = await asyncpg.connect(url)
        try:
            await seed(conn)
        finally:
            await conn.close()

    asyncio.run(main())
"""
libs/backend/resume-python/src/service.py
ResumeService — the business logic layer.

Takes any IResumeRepository and uses it to fetch data.
All data methods accept a `resume` param that selects the variant.
get_tech_stack() reads live runtime info from the Python
process itself — no database needed for that part.
"""

from __future__ import annotations

import platform
import sys
from datetime import datetime, timezone

from .models import (
    DatabaseDialect,
    DatabaseInfo,
    Education,
    EnvironmentInfo,
    FrameworkInfo,
    OsInfo,
    PackageInfo,
    Profile,
    Project,
    RuntimeInfo,
    SkillCategory,
    TechStackInfo,
    WorkExperience,
)
from .repository import DEFAULT_RESUME, IResumeRepository


def _pkg_version(name: str) -> str:
    """Safely read an installed package version."""
    try:
        from importlib.metadata import version
        return version(name)
    except Exception:
        return 'unknown'


class ResumeService:

    def __init__(self, repository: IResumeRepository) -> None:
        self._repo = repository

    async def get_profile(self, resume: str = DEFAULT_RESUME) -> Profile:
        return await self._repo.find_profile(resume)

    async def get_work_experience(self, resume: str = DEFAULT_RESUME) -> list[WorkExperience]:
        return await self._repo.find_work_experience(resume)

    async def get_education(self, resume: str = DEFAULT_RESUME) -> list[Education]:
        return await self._repo.find_education(resume)

    async def get_skills(self, resume: str = DEFAULT_RESUME) -> list[SkillCategory]:
        return await self._repo.find_skills(resume)

    async def get_projects(self, resume: str = DEFAULT_RESUME) -> list[Project]:
        return await self._repo.find_projects(resume)

    async def get_tech_stack(self) -> TechStackInfo:
        """
        The phpinfo() of the stack — every value is live, nothing hardcoded.
        database.connected = False means we are in seed/fallback mode.
        """
        python_version   = sys.version.split()[0]
        implementation   = platform.python_implementation()
        fastapi_version  = _pkg_version('fastapi')
        uvicorn_version  = _pkg_version('uvicorn')
        pydantic_version = _pkg_version('pydantic')
        asyncpg_version  = _pkg_version('asyncpg')

        db_version   = await self._repo.get_database_version()
        db_name      = await self._repo.get_database_name()
        db_connected = 'seed mode' not in db_version.lower()

        dialect = DatabaseDialect.postgres
        if 'mysql' in db_name.lower():
            dialect = DatabaseDialect.mysql
        elif 'mssql' in db_name.lower() or 'sql server' in db_name.lower():
            dialect = DatabaseDialect.mssql
        elif 'mongo' in db_name.lower():
            dialect = DatabaseDialect.mongodb

        return TechStackInfo(
            generated_at=datetime.now(timezone.utc).isoformat(),
            runtime=RuntimeInfo(
                name='Python',
                version=python_version,
                implementation=implementation,
            ),
            framework=FrameworkInfo(
                name='FastAPI',
                version=fastapi_version,
                extra={
                    'uvicorn':  uvicorn_version,
                    'pydantic': pydantic_version,
                },
            ),
            database=DatabaseInfo(
                name=db_name,
                version=db_version,
                dialect=dialect,
                connected=db_connected,
            ),
            os=OsInfo(
                platform=platform.system(),
                release=platform.release(),
                architecture=platform.machine(),
            ),
            environment=EnvironmentInfo(
                name='development',
                timezone='UTC',
            ),
            packages=[
                PackageInfo(name='fastapi',  version=fastapi_version,  category='http'),
                PackageInfo(name='pydantic', version=pydantic_version, category='validation'),
                PackageInfo(name='uvicorn',  version=uvicorn_version,  category='server'),
                PackageInfo(name='asyncpg',  version=asyncpg_version,  category='database'),
            ],
        )
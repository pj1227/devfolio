from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

import asyncpg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from devfolio_resume_python.repository import SeedRepository
from devfolio_resume_python.service import ResumeService

from api_python.routers import (
    education,
    profile,
    projects,
    skills,
    tech_stack,
    work_experience,
)

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        database_url = os.getenv('DATABASE_URL')

        if database_url:
            logger.info('DATABASE_URL found — connecting to Postgres...')
            try:
                pool = await asyncpg.create_pool(database_url, min_size=2, max_size=10)

                # Run seeder on startup — safe to run multiple times
                from devfolio_resume_python.seeder import seed
                async with pool.acquire() as conn:
                    await seed(conn)

                from devfolio_resume_python.postgres_repository import PostgresRepository
                repo = PostgresRepository(pool)
                logger.info('Connected to Postgres ✓')
            except Exception as e:
                logger.warning(f'Postgres connection failed: {e} — falling back to SeedRepository')
                pool = None
                repo = SeedRepository()
        else:
            logger.info('No DATABASE_URL — using SeedRepository')
            pool = None
            repo = SeedRepository()

        app.state.service = ResumeService(repo)

        yield

        # Cleanup
        if pool:
            await pool.close()

    app = FastAPI(
        title='DevFolio API — Python',
        description='Resume data API built with FastAPI',
        version='1.0.0',
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_methods=['GET'],
        allow_headers=['*'],
    )

    app.include_router(profile.router)
    app.include_router(work_experience.router)
    app.include_router(education.router)
    app.include_router(skills.router)
    app.include_router(projects.router)
    app.include_router(tech_stack.router)

    return app


app = create_app()

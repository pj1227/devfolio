from __future__ import annotations

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from devfolio_resume_python.repository import SeedRepository
from devfolio_resume_python.service import ResumeService

from api_python.routers import (
    profile,
    work_experience,
    education,
    skills,
    projects,
    tech_stack,
)


def create_app() -> FastAPI:
    repo = SeedRepository()
    service = ResumeService(repo)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.service = service
        yield

    app = FastAPI(
        title="DevFolio API — Python",
        description="Resume data API built with FastAPI",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["GET"],
        allow_headers=["*"],
    )

    app.include_router(profile.router)
    app.include_router(work_experience.router)
    app.include_router(education.router)
    app.include_router(skills.router)
    app.include_router(projects.router)
    app.include_router(tech_stack.router)

    return app


app = create_app()
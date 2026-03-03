"""
devfolio_resume_python/runtime.py

Live runtime introspection — now delegated to ResumeService.get_tech_stack().
This module is kept for backwards compatibility but its logic has moved.

Use ResumeService.get_tech_stack() for live runtime data.
"""
from __future__ import annotations

import os
import platform
import sys
from importlib.metadata import version, PackageNotFoundError

from devfolio_resume_python.models import (
    TechStackInfo, RuntimeInfo, FrameworkInfo, DatabaseInfo,
    DatabaseDialect, OsInfo, EnvironmentInfo, PackageInfo,
)
from datetime import datetime, timezone


def _pkg_version(name: str) -> str:
    try:
        return version(name)
    except PackageNotFoundError:
        return "unknown"


def get_live_tech_stack() -> TechStackInfo:
    """
    Returns a TechStackInfo snapshot of the live runtime environment.
    Deprecated: use ResumeService.get_tech_stack() instead.
    """
    python_version   = sys.version.split()[0]
    fastapi_version  = _pkg_version("fastapi")
    uvicorn_version  = _pkg_version("uvicorn")
    pydantic_version = _pkg_version("pydantic")
    asyncpg_version  = _pkg_version("asyncpg")

    return TechStackInfo(
        generated_at=datetime.now(timezone.utc).isoformat(),
        runtime=RuntimeInfo(
            name="Python",
            version=python_version,
            implementation=platform.python_implementation(),
        ),
        framework=FrameworkInfo(
            name="FastAPI",
            version=fastapi_version,
            extra={
                "uvicorn":  uvicorn_version,
                "pydantic": pydantic_version,
            },
        ),
        database=DatabaseInfo(
            name="None (seed mode)",
            version="None",
            dialect=DatabaseDialect.postgres,
            connected=False,
        ),
        os=OsInfo(
            platform=platform.system(),
            release=platform.release(),
            architecture=platform.machine(),
        ),
        environment=EnvironmentInfo(
            name="development",
            timezone="UTC",
        ),
        packages=[
            PackageInfo(name="fastapi",   version=fastapi_version,  category="http"),
            PackageInfo(name="pydantic",  version=pydantic_version, category="validation"),
            PackageInfo(name="uvicorn",   version=uvicorn_version,  category="server"),
            PackageInfo(name="asyncpg",   version=asyncpg_version,  category="database"),
        ],
    )
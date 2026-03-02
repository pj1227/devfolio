from __future__ import annotations

import os
import platform
import sys
from importlib.metadata import version, PackageNotFoundError

from devfolio_resume_python.models import TechStackInfo


def _pkg_version(name: str) -> str:
    try:
        return version(name)
    except PackageNotFoundError:
        return "unknown"


def get_live_tech_stack() -> list[TechStackInfo]:
    return [
        TechStackInfo(
            name="Python",
            category="runtime",
            related=["CPython"],
            years_experience=None,
            meta={
                "version": sys.version,
                "implementation": platform.python_implementation(),
            },
        ),
        TechStackInfo(
            name="FastAPI",
            category="framework",
            related=["Starlette", "Pydantic"],
            years_experience=None,
            meta={"version": _pkg_version("fastapi")},
        ),
        TechStackInfo(
            name="Uvicorn",
            category="server",
            related=["ASGI"],
            years_experience=None,
            meta={"version": _pkg_version("uvicorn")},
        ),
        TechStackInfo(
            name="Pydantic",
            category="library",
            related=["FastAPI"],
            years_experience=None,
            meta={"version": _pkg_version("pydantic")},
        ),
        TechStackInfo(
            name="OS",
            category="platform",
            related=[],
            years_experience=None,
            meta={
                "system": platform.system(),
                "release": platform.release(),
                "machine": platform.machine(),
                "hostname": os.uname().nodename,
            },
        ),
    ]
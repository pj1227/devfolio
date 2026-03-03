"""
libs/backend/resume-python/src/models.py
Pydantic v2 models mirroring the TypeScript interfaces.

CamelModel base class serializes snake_case fields to camelCase
automatically so the API response matches what the TypeScript
frontend expects without any manual field renaming.
"""

from __future__ import annotations
from typing import Optional
from enum import Enum
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """
    Base model: snake_case internally, camelCase in JSON output.
    Python:   start_date, company_url, years_of_experience
    JSON out: startDate,  companyUrl,  yearsOfExperience
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


# ── Enums ─────────────────────────────────────────────────────────────────────

class ProficiencyLevel(str, Enum):
    beginner     = 'beginner'
    intermediate = 'intermediate'
    advanced     = 'advanced'
    expert       = 'expert'


class ProjectCategory(str, Enum):
    web     = 'web'
    api     = 'api'
    cli     = 'cli'
    library = 'library'
    mobile  = 'mobile'
    devops  = 'devops'
    data    = 'data'
    other   = 'other'


class DatabaseDialect(str, Enum):
    postgres = 'postgres'
    mysql    = 'mysql'
    mssql    = 'mssql'
    sqlite   = 'sqlite'
    mongodb  = 'mongodb'


# ── Domain models ─────────────────────────────────────────────────────────────

class Profile(CamelModel):
    name:       str
    title:      str
    clearance:  Optional[str] = None   # e.g. "Active Top Secret Clearance"
    summary:    str
    email:      str
    location:   str
    website:    Optional[str] = None
    github:     Optional[str] = None
    linkedin:   Optional[str] = None
    avatar_url: Optional[str] = None


class WorkExperience(CamelModel):
    id:           str
    company:      str
    title:        str
    location:     str
    start_date:   str
    end_date:     Optional[str] = None
    current:      bool
    summary:      str
    highlights:   list[str]
    technologies: list[str]
    company_url:  Optional[str] = None


class Education(CamelModel):
    id:          str
    institution: str
    degree:      str
    field:       str
    start_date:  str
    end_date:    Optional[str] = None
    current:     bool
    highlights:  Optional[list[str]] = None


class Skill(CamelModel):
    name:                str
    proficiency:         ProficiencyLevel
    years_of_experience: Optional[int] = None
    highlighted:         Optional[bool] = None


class SkillCategory(CamelModel):
    category: str
    skills:   list[Skill]


class Project(CamelModel):
    id:           str
    name:         str
    description:  str
    summary:      str
    technologies: list[str]
    github_url:   Optional[str] = None
    live_url:     Optional[str] = None
    featured:     bool
    start_date:   str
    current:      bool
    highlights:   list[str]
    category:     ProjectCategory


# ── TechStack models ──────────────────────────────────────────────────────────

class RuntimeInfo(CamelModel):
    name:           str
    version:        str
    implementation: Optional[str] = None


class FrameworkInfo(CamelModel):
    name:    str
    version: str
    extra:   Optional[dict[str, str]] = None


class DatabaseInfo(CamelModel):
    name:      str
    version:   str
    dialect:   DatabaseDialect
    connected: bool


class OsInfo(CamelModel):
    platform:     str
    release:      str
    architecture: str


class EnvironmentInfo(CamelModel):
    name:     str
    timezone: str


class PackageInfo(CamelModel):
    name:     str
    version:  str
    category: Optional[str] = None


class TechStackInfo(CamelModel):
    generated_at: str
    runtime:      RuntimeInfo
    framework:    FrameworkInfo
    database:     DatabaseInfo
    os:           OsInfo
    environment:  EnvironmentInfo
    packages:     list[PackageInfo]


# ── API response envelope ─────────────────────────────────────────────────────

class StackIdentifier(CamelModel):
    frontend: Optional[str] = None
    backend:  str
    database: str


class ApiMeta(CamelModel):
    timestamp:   str
    stack:       StackIdentifier
    duration_ms: float


class ApiResponse(CamelModel):
    data: object
    meta: ApiMeta
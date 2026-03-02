from __future__ import annotations

from typing import Any
from pydantic import BaseModel, ConfigDict
import re


def _to_camel(snake: str) -> str:
    components = snake.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=_to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class Profile(CamelModel):
    name: str
    title: str
    email: str
    phone: str
    location: str
    linkedin: str
    github: str
    summary: str


class WorkExperience(CamelModel):
    company: str
    title: str
    start_date: str
    end_date: str | None = None
    location: str
    highlights: list[str]


class Education(CamelModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: str | None = None


class Skill(CamelModel):
    name: str
    proficiency: str  # e.g. "expert", "proficient", "familiar"


class SkillCategory(CamelModel):
    category: str
    skills: list[Skill]


class Project(CamelModel):
    name: str
    description: str
    tech_stack: list[str]
    url: str | None = None
    highlights: list[str] = []


class TechStackInfo(CamelModel):
    """
    Graph node for the tech-stack introspection endpoint.
    Represents a technology and its relationships to others.
    """
    name: str
    category: str
    related: list[str] = []
    years_experience: float | None = None
    meta: dict[str, str] = {}


class ResumeEnvelope(CamelModel):
    """Top-level API response wrapper."""
    data: Any
    version: str = "1.0"
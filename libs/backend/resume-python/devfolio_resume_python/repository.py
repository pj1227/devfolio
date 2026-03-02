from __future__ import annotations

from typing import Protocol, runtime_checkable

from devfolio_resume_python.models import (
    Education,
    Profile,
    Project,
    SkillCategory,
    TechStackInfo,
    WorkExperience,
    Skill,
)


@runtime_checkable
class IResumeRepository(Protocol):
    def get_profile(self) -> Profile: ...
    def get_work_experience(self) -> list[WorkExperience]: ...
    def get_education(self) -> list[Education]: ...
    def get_skills(self) -> list[SkillCategory]: ...
    def get_projects(self) -> list[Project]: ...
    def get_tech_stack(self) -> list[TechStackInfo]: ...


class SeedRepository:
    """
    In-memory repository seeded with Joel's real resume data.
    No database required — the API works immediately with this.
    """

    def get_profile(self) -> Profile:
        return Profile(
            name="Joel Patterson",
            title="Senior Software Engineer",
            email="pj1227@gmail.com",
            phone="555-555-5555",
            location="United States",
            linkedin="https://linkedin.com/in/joelpatterson",
            github="https://github.com/pj1227",
            summary=(
                "Senior Software Engineer with 15+ years of experience designing and "
                "building scalable, polyglot systems across web, cloud, and enterprise "
                "domains. Passionate about clean architecture, developer tooling, and "
                "demonstrating that the right tool for the job matters."
            ),
        )

    def get_work_experience(self) -> list[WorkExperience]:
        return [
            WorkExperience(
                company="Accenture Federal Services",
                title="Senior Software Engineer",
                start_date="2021-01",
                end_date=None,
                location="Remote",
                highlights=[
                    "Architected and delivered full-stack features across React, Node.js, and Java microservices",
                    "Led migration of legacy monolith to event-driven microservices on AWS",
                    "Mentored junior engineers and led code reviews across distributed teams",
                ],
            ),
            WorkExperience(
                company="Leidos",
                title="Software Engineer III",
                start_date="2018-06",
                end_date="2021-01",
                location="Remote",
                highlights=[
                    "Built REST APIs in Java Spring Boot serving 100k+ daily requests",
                    "Developed Angular front-end for internal analytics dashboard",
                    "Introduced automated testing culture, raising coverage from 12% to 78%",
                ],
            ),
            WorkExperience(
                company="SAIC",
                title="Software Engineer",
                start_date="2015-03",
                end_date="2018-06",
                location="Chantilly, VA",
                highlights=[
                    "Developed data ingestion pipelines in Python processing 50GB+ daily",
                    "Built internal tooling reducing deployment time by 40%",
                ],
            ),
        ]

    def get_education(self) -> list[Education]:
        return [
            Education(
                institution="University of Maryland Global Campus",
                degree="Bachelor of Science",
                field="Computer Science",
                start_date="2010-09",
                end_date="2015-05",
            )
        ]

    def get_skills(self) -> list[SkillCategory]:
        return [
            SkillCategory(
                category="Languages",
                skills=[
                    Skill(name="TypeScript", proficiency="expert"),
                    Skill(name="Python", proficiency="expert"),
                    Skill(name="Java", proficiency="proficient"),
                    Skill(name="Go", proficiency="familiar"),
                    Skill(name="Rust", proficiency="familiar"),
                ],
            ),
            SkillCategory(
                category="Frontend",
                skills=[
                    Skill(name="React", proficiency="expert"),
                    Skill(name="Angular", proficiency="proficient"),
                    Skill(name="Vue", proficiency="proficient"),
                ],
            ),
            SkillCategory(
                category="Backend",
                skills=[
                    Skill(name="Node.js / Express", proficiency="expert"),
                    Skill(name="FastAPI", proficiency="expert"),
                    Skill(name="Spring Boot", proficiency="proficient"),
                ],
            ),
            SkillCategory(
                category="Databases",
                skills=[
                    Skill(name="PostgreSQL", proficiency="expert"),
                    Skill(name="MongoDB", proficiency="proficient"),
                    Skill(name="Redis", proficiency="proficient"),
                    Skill(name="SQLite", proficiency="proficient"),
                ],
            ),
            SkillCategory(
                category="Cloud & DevOps",
                skills=[
                    Skill(name="AWS", proficiency="proficient"),
                    Skill(name="Docker", proficiency="expert"),
                    Skill(name="Kubernetes", proficiency="familiar"),
                    Skill(name="GitHub Actions", proficiency="expert"),
                ],
            ),
        ]

    def get_projects(self) -> list[Project]:
        return [
            Project(
                name="DevFolio",
                description=(
                    "Polyglot portfolio application demonstrating senior-level full-stack "
                    "skills. User-selectable frontend, backend, and database combinations "
                    "all serving the same resume data via a unified API contract."
                ),
                tech_stack=["TypeScript", "React", "Python", "FastAPI", "Node.js", "PostgreSQL", "MongoDB", "Docker", "NX"],
                url="https://github.com/pj1227/devfolio",
                highlights=[
                    "NX monorepo managing 5+ apps and 10+ libs across 3 languages",
                    "Shared API contract (OpenAPI) across Python, Node, and Java backends",
                    "Single Docker Compose brings up any combination of stack",
                ],
            )
        ]

    def get_tech_stack(self) -> list[TechStackInfo]:
        return [
            TechStackInfo(name="React", category="frontend", related=["TypeScript", "Vite"], years_experience=6.0),
            TechStackInfo(name="Angular", category="frontend", related=["TypeScript"], years_experience=4.0),
            TechStackInfo(name="Vue", category="frontend", related=["TypeScript"], years_experience=2.0),
            TechStackInfo(name="FastAPI", category="backend", related=["Python", "Pydantic"], years_experience=3.0),
            TechStackInfo(name="Node.js / Express", category="backend", related=["TypeScript"], years_experience=7.0),
            TechStackInfo(name="Spring Boot", category="backend", related=["Java"], years_experience=4.0),
            TechStackInfo(name="PostgreSQL", category="database", related=["asyncpg", "SQLAlchemy"], years_experience=8.0),
            TechStackInfo(name="MongoDB", category="database", related=["Motor", "Beanie"], years_experience=4.0),
            TechStackInfo(name="Docker", category="devops", related=["Docker Compose", "Kubernetes"], years_experience=6.0),
            TechStackInfo(name="NX", category="tooling", related=["pnpm", "TypeScript"], years_experience=2.0),
        ]
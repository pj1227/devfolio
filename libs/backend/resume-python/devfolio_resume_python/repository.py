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
    In-memory repository seeded with Joel M. Cossins's real resume data.
    No database required — the API works immediately with this.
    """

    def get_profile(self) -> Profile:
        return Profile(
            name="Joel M. Cossins",
            title="Senior Full Stack Software Developer",
            email="joel1227@proton.me",
            phone="(734) 224-4767",
            location="Libby, MT, US",
            linkedin="https://linkedin.com/in/joelcossins",
            github="https://github.com/pj1227",
            summary=(
                "Senior Full Stack Software Developer with 10+ years of experience "
                "building scalable, data-driven applications across modern web and backend "
                "platforms. Active Top Secret clearance. Extensive professional experience "
                "with Angular and C#/.NET services, complemented by hands-on development "
                "using React, Vue/Nuxt, and Python. Strong background in designing internal "
                "APIs, client-server architectures, and SQL Server-backed systems in "
                "enterprise and mission-critical environments."
            ),
        )

    def get_work_experience(self) -> list[WorkExperience]:
        return [
            WorkExperience(
                company="Independent Software Developer",
                title="Senior Full Stack Software Developer",
                start_date="2025-08",
                end_date=None,
                location="Libby, MT, US",
                highlights=[
                    "Designed and developed professional full stack applications using Angular, React, and Vue/Nuxt backed by C#/.NET services",
                    "Built RESTful and internal APIs to support client-server and web-based applications",
                    "Built a WPF desktop application utilizing XAML, MVVM architecture, and Entity Framework to demonstrate modern .NET UI development",
                    "Worked with SQL Server and Entity Framework ORM for data access and persistence",
                    "Applied AI-assisted development (AIDD) techniques to accelerate design, refactoring, and testing while maintaining code quality",
                    "Managed source control and documentation using Git and GitHub",
                ],
            ),
            WorkExperience(
                company="BigBear.ai",
                title="Software Developer",
                start_date="2015-06",
                end_date="2025-08",
                location="Ann Arbor, MI, US",
                highlights=[
                    "Led design, development, and delivery of complex customer-specific modules in a full stack client-server architecture supporting mission-critical U.S. Army systems",
                    "Developed rich, data-driven UIs using Angular — components, services, guards, directives, pipes, and state management patterns",
                    "Re-architected Silverlight/XAML modules to Angular + .NET Core, preserving functional parity while improving scalability and maintainability",
                    "Designed and implemented C#/.NET Core backend services and internal APIs enabling secure data access and business logic for web clients",
                    "Built and optimized SQL Server data models including stored procedures, user-defined types, and functions supporting reporting and operational workflows",
                    "Collaborated on enterprise reporting services using Telerik Kendo, Syncfusion, EPPlus, and Dundas — delivering exportable products for senior leadership",
                    "Provided technical leadership and strategic guidance to onsite project liaisons; participated in code reviews and collaborated with QA",
                ],
            ),
            WorkExperience(
                company="DTE Energy Trading",
                title="Programmer/Analyst",
                start_date="2004-08",
                end_date="2015-06",
                location="Ann Arbor, MI, US",
                highlights=[
                    "Developed websites, desktop applications, scripts, and reporting services using .NET, C#, VBScript, and Java",
                    "Built logging/reporting pages, gas utilization displays, and reusable services to streamline energy trading operations",
                    "Created a NYMEX natural gas report displaying week-over-week, month-over-month, and year-over-year price changes with historical futures data",
                    "Designed and implemented an internal NuGet server to manage .NET package dependencies across all DTE ET applications",
                    "Designed numerous automations for gas traders — web scraping, file downloads, email attachment parsing, and database persistence — saving hours daily",
                    "Coordinated power and gas schedules across MISO, PJM, and NEPOOL; reduced scheduling coordination time from 7 hours to 4 hours",
                ],
            ),
            WorkExperience(
                company="MCI WorldCom / UUNet / ANS Communications",
                title="LAN/WAN Install Engineer",
                start_date="1998-11",
                end_date="2003-03",
                location="US",
                highlights=[
                    "Configured and maintained corporate network infrastructure ensuring reliable internet and DNS services",
                    "Tested, installed, configured, and troubleshot network communications hardware and digital circuits per U.S. and international specifications",
                    "Designed and implemented a web-based library of instructional documents for engineer training and development",
                ],
            ),
            WorkExperience(
                company="United States Air Force",
                title="Communication Computer Systems Control Specialist",
                start_date="1991-11",
                end_date="1998-11",
                location="Various",
                highlights=[
                    "Managed, configured, and maintained communication networks for mission-critical operations",
                    "Installed servers, patch panels, and network systems supporting NORAD, USSPACECOM, and Air Force Space Command",
                    "Configured and maintained routers linking Incirlik AB to the USAF NIPRNet",
                    "Delivered C3 support to Joint Task Force Southwest Asia",
                    "Restored full network functionality at Shaw AFB by mapping the 9th Air Force Squadron's LAN",
                    "Streamlined training processes for 27 personnel at Incirlik AB ensuring compliance with operational standards",
                ],
            ),
        ]

    def get_education(self) -> list[Education]:
        return [
            Education(
                institution="American Intercontinental University",
                degree="Bachelor of Science",
                field="Information Technology",
                start_date="2007",
                end_date="2008",
            ),
            Education(
                institution="College of the Air Force",
                degree="Associate of Applied Science",
                field="Electronic Systems Technology",
                start_date="1995",
                end_date="1998",
            ),
        ]

    def get_skills(self) -> list[SkillCategory]:
        return [
            SkillCategory(
                category="Frontend",
                skills=[
                    Skill(name="Angular", proficiency="expert"),
                    Skill(name="React", proficiency="proficient"),
                    Skill(name="Vue / Nuxt", proficiency="proficient"),
                    Skill(name="TypeScript", proficiency="expert"),
                    Skill(name="JavaScript", proficiency="expert"),
                    Skill(name="HTML / CSS", proficiency="expert"),
                ],
            ),
            SkillCategory(
                category="Backend",
                skills=[
                    Skill(name="C# / .NET / .NET Core", proficiency="expert"),
                    Skill(name="RESTful APIs", proficiency="expert"),
                    Skill(name="WCF (legacy)", proficiency="proficient"),
                    Skill(name="Python / FastAPI", proficiency="proficient"),
                    Skill(name="Java", proficiency="familiar"),
                ],
            ),
            SkillCategory(
                category="Desktop & UI Frameworks",
                skills=[
                    Skill(name="WPF / XAML", proficiency="proficient"),
                    Skill(name="Silverlight (MVVM)", proficiency="proficient"),
                    Skill(name="MVVM / MVC", proficiency="expert"),
                ],
            ),
            SkillCategory(
                category="Data",
                skills=[
                    Skill(name="SQL Server", proficiency="expert"),
                    Skill(name="Entity Framework (ORM)", proficiency="expert"),
                    Skill(name="Stored Procedures & Functions", proficiency="expert"),
                    Skill(name="Relational Database Design", proficiency="expert"),
                    Skill(name="PostgreSQL", proficiency="familiar"),
                ],
            ),
            SkillCategory(
                category="Testing & Quality",
                skills=[
                    Skill(name="Unit Testing / TDD", proficiency="proficient"),
                    Skill(name="Code Reviews", proficiency="expert"),
                    Skill(name="AI-Assisted Development (AIDD)", proficiency="proficient"),
                ],
            ),
            SkillCategory(
                category="Tools & DevOps",
                skills=[
                    Skill(name="Git / GitHub / Bitbucket", proficiency="expert"),
                    Skill(name="Visual Studio / VS Code", proficiency="expert"),
                    Skill(name="Docker", proficiency="proficient"),
                    Skill(name="Jira / Confluence", proficiency="proficient"),
                    Skill(name="NX Monorepo", proficiency="proficient"),
                ],
            ),
        ]

    def get_projects(self) -> list[Project]:
        return [
            Project(
                name="DevFolio",
                description=(
                    "Polyglot portfolio application demonstrating senior-level full stack "
                    "skills. User-selectable frontend, backend, and database combinations "
                    "all serving the same resume data via a unified API contract. Built in "
                    "an NX monorepo with Python/FastAPI, Node.js, React, Vue, and Angular "
                    "implementations."
                ),
                tech_stack=[
                    "TypeScript", "React", "Vue/Nuxt", "Angular",
                    "Python", "FastAPI", "C#/.NET", "Node.js",
                    "PostgreSQL", "SQL Server", "Docker", "NX",
                ],
                url="https://github.com/pj1227/devfolio",
                highlights=[
                    "NX monorepo managing multiple apps and libs across 3+ languages",
                    "Shared API contract (OpenAPI) across Python, Node, and .NET backends",
                    "Live runtime introspection endpoint proving each stack is real and running",
                    "Single Docker Compose brings up any combination of frontend, backend, and database",
                ],
            ),
        ]

    def get_tech_stack(self) -> list[TechStackInfo]:
        return [
            TechStackInfo(name="Angular", category="frontend", related=["TypeScript", "RxJS"], years_experience=8.0),
            TechStackInfo(name="React", category="frontend", related=["TypeScript", "Vite"], years_experience=3.0),
            TechStackInfo(name="Vue / Nuxt", category="frontend", related=["TypeScript"], years_experience=2.0),
            TechStackInfo(name="C# / .NET Core", category="backend", related=["Entity Framework", "WCF"], years_experience=10.0),
            TechStackInfo(name="FastAPI", category="backend", related=["Python", "Pydantic"], years_experience=1.0),
            TechStackInfo(name="SQL Server", category="database", related=["Entity Framework", "T-SQL"], years_experience=10.0),
            TechStackInfo(name="PostgreSQL", category="database", related=["asyncpg"], years_experience=1.0),
            TechStackInfo(name="WPF / XAML", category="desktop", related=["MVVM", "C#"], years_experience=5.0),
            TechStackInfo(name="Docker", category="devops", related=["Docker Compose"], years_experience=1.0),
            TechStackInfo(name="NX", category="tooling", related=["pnpm", "TypeScript"], years_experience=1.0),
        ]
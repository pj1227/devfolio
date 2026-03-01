"""
libs/backend/resume-python/src/repository.py
Repository Protocol (interface) and in-memory SeedRepository.

IResumeRepository is a Protocol — Python's equivalent of a TypeScript
interface. Any class implementing all these methods satisfies it,
whether it talks to Postgres, MySQL, or in-memory data.

SeedRepository is the fallback when no database is configured.
The API works immediately with no DB setup required.
"""

from __future__ import annotations
from typing import Protocol, runtime_checkable

from .models import (
    Profile, WorkExperience, Education,
    SkillCategory, Skill, Project,
    ProficiencyLevel, ProjectCategory,
)


@runtime_checkable
class IResumeRepository(Protocol):
    async def find_profile(self) -> Profile: ...
    async def find_work_experience(self) -> list[WorkExperience]: ...
    async def find_education(self) -> list[Education]: ...
    async def find_skills(self) -> list[SkillCategory]: ...
    async def find_projects(self) -> list[Project]: ...
    async def get_database_version(self) -> str: ...
    async def get_database_name(self) -> str: ...


class SeedRepository:
    """
    In-memory repository using Joel's real resume data.
    Used when DATABASE_URL is not set or DB is unreachable.
    """

    async def find_profile(self) -> Profile:
        return Profile(
            name='Joel M. Cossins',
            title='Senior Full Stack Software Developer',
            summary=(
                'Senior Full Stack Software Developer with 10+ years of experience '
                'building scalable, data-driven applications across modern web and '
                'backend platforms. Extensive professional experience with Angular '
                'and C#/.NET services, complemented by hands-on development using '
                'React and Vue/Nuxt. Active Top Secret Clearance.'
            ),
            email='joel1227@proton.me',
            location='Remote — US',
            website='https://joelcossins.dev',
            github='https://github.com/pj1227',
        )

    async def find_work_experience(self) -> list[WorkExperience]:
        return [
            WorkExperience(
                id='we-001',
                company='Independent Software Developer',
                title='Independent Software Developer',
                location='Libby, MT',
                start_date='2025-08',
                current=True,
                summary='Designing and developing professional full stack applications.',
                highlights=[
                    'Designed and developed full stack applications using Angular, React, and Vue/Nuxt backed by C#/.NET services.',
                    'Built RESTful and internal APIs to support client-server and web-based applications.',
                    'Built a WPF desktop application utilizing XAML, MVVM architecture, and Entity Framework.',
                    'Applied AI-assisted development techniques to accelerate design and testing.',
                    'Managed source control and documentation using Git and GitHub.',
                ],
                technologies=[
                    'Angular', 'React', 'Vue', 'Nuxt', 'TypeScript',
                    'C#', '.NET Core', 'WPF', 'XAML', 'MVVM',
                    'SQL Server', 'Entity Framework', 'Git',
                ],
            ),
            WorkExperience(
                id='we-002',
                company='BigBear.ai',
                title='Software Developer',
                location='Ann Arbor, MI',
                start_date='2015-06',
                end_date='2025-08',
                current=False,
                summary=(
                    'Led design and delivery of mission-critical U.S. Army systems '
                    'for 10 years. Architected the re-architecture from '
                    'Silverlight/XAML to Angular/.NET Core.'
                ),
                highlights=[
                    'Led design and implementation of modules using Silverlight (XAML, MVVM).',
                    'Re-architected modules from Silverlight to Angular and .NET Core, preserving functional parity.',
                    'Used .NET Core to develop server-side APIs connecting Angular to MS SQL databases.',
                    'Developed rich Angular UIs using components, directives, pipes, guards, and services.',
                    'Designed MS SQL user-defined types, functions, and stored procedures for reporting.',
                    'Collaborated on reporting services using Telerik Kendo, Syncfusion, EPPlus, and Dundas.',
                ],
                technologies=[
                    'Angular', 'TypeScript', 'C#', '.NET Core',
                    'SQL Server', 'Silverlight', 'XAML', 'MVVM',
                    'WCF', 'Telerik Kendo', 'Syncfusion', 'EPPlus',
                ],
                company_url='https://bigbear.ai',
            ),
            WorkExperience(
                id='we-003',
                company='DTE Energy Trading',
                title='Programmer/Analyst',
                location='Ann Arbor, MI',
                start_date='2004-08',
                end_date='2015-06',
                current=False,
                summary='Full stack developer in an energy trading environment.',
                highlights=[
                    'Used .NET, C#, VBScript, and Java to develop websites, desktop apps, and reporting services.',
                    'Created logging and reporting pages for natural gas trading along the Eastern seaboard.',
                    'Created a gas utilization page displaying market prices, pipeline utilization, and weather.',
                    'Created an internal NuGet server managing .NET package dependencies.',
                    'Designed automations saving hours per day — web scraping, file downloading, email parsing.',
                    'Reduced scheduling coordination time from 7 hours to 4 hours.',
                ],
                technologies=['C#', '.NET', 'VBScript', 'Java', 'SQL Server', 'ASP.NET', 'NuGet'],
            ),
            WorkExperience(
                id='we-004',
                company='MCI WorldCom / UUNet / ANS Communications',
                title='LAN/WAN Install Engineer',
                location='US',
                start_date='1998-11',
                end_date='2003-03',
                current=False,
                summary='Configured and maintained corporate network infrastructure.',
                highlights=[
                    'Delivered Internet installations per U.S. and international specifications.',
                    'Configured and administered DNS infrastructure.',
                    'Designed a web-based training library for fellow engineers.',
                ],
                technologies=['Networking', 'DNS', 'LAN/WAN', 'TCP/IP'],
            ),
            WorkExperience(
                id='we-005',
                company='United States Air Force',
                title='Communication Computer Systems Control Specialist',
                location='Various',
                start_date='1991-11',
                end_date='1998-11',
                current=False,
                summary='Managed mission-critical communication networks supporting NORAD, USSPACECOM, and AFSPC.',
                highlights=[
                    'Managed communication networks for mission-critical operations.',
                    'Installed infrastructure supporting NORAD, US Space Command, and Air Force Space Command.',
                    'Configured routers linking Incirlik AB to the USAF NIPRNet.',
                    'Delivered C3 support to the Joint Task Force Southwest Asia.',
                    "Restored network functionality at Shaw AFB by mapping the 9th Air Force Squadron's LAN.",
                ],
                technologies=['Networking', 'Routers', 'LAN/WAN', 'Communications Systems'],
            ),
        ]

    async def find_education(self) -> list[Education]:
        return [
            Education(
                id='edu-001',
                institution='American Intercontinental University',
                degree='Bachelor of Science',
                field='Information Technology',
                start_date='2007-01',
                end_date='2008-12',
                current=False,
                highlights=['AIU Online'],
            ),
            Education(
                id='edu-002',
                institution='College of the Air Force',
                degree='Associate of Applied Science',
                field='Electronic Systems Technology',
                start_date='1995-01',
                end_date='1998-12',
                current=False,
                highlights=['Completed during active duty USAF service'],
            ),
        ]

    async def find_skills(self) -> list[SkillCategory]:
        return [
            SkillCategory(category='Frontend', skills=[
                Skill(name='Angular', proficiency=ProficiencyLevel.expert, years_of_experience=10, highlighted=True),
                Skill(name='React', proficiency=ProficiencyLevel.advanced, years_of_experience=3, highlighted=True),
                Skill(name='Vue / Nuxt', proficiency=ProficiencyLevel.advanced, years_of_experience=2),
                Skill(name='TypeScript', proficiency=ProficiencyLevel.expert, years_of_experience=8, highlighted=True),
                Skill(name='JavaScript', proficiency=ProficiencyLevel.expert, years_of_experience=12),
                Skill(name='HTML / CSS', proficiency=ProficiencyLevel.expert, years_of_experience=15),
            ]),
            SkillCategory(category='Backend', skills=[
                Skill(name='C# / .NET Core', proficiency=ProficiencyLevel.expert, years_of_experience=10, highlighted=True),
                Skill(name='RESTful APIs', proficiency=ProficiencyLevel.expert, years_of_experience=10),
                Skill(name='WCF (legacy)', proficiency=ProficiencyLevel.advanced, years_of_experience=6),
                Skill(name='WPF / XAML', proficiency=ProficiencyLevel.advanced, years_of_experience=4),
                Skill(name='MVVM / MVC', proficiency=ProficiencyLevel.expert, years_of_experience=10),
            ]),
            SkillCategory(category='Data', skills=[
                Skill(name='SQL Server', proficiency=ProficiencyLevel.expert, years_of_experience=10, highlighted=True),
                Skill(name='Entity Framework', proficiency=ProficiencyLevel.expert, years_of_experience=8),
                Skill(name='Stored Procedures', proficiency=ProficiencyLevel.expert, years_of_experience=10),
                Skill(name='Relational DB Design', proficiency=ProficiencyLevel.expert, years_of_experience=10),
            ]),
            SkillCategory(category='Architecture & Design', skills=[
                Skill(name='Full Stack Architecture', proficiency=ProficiencyLevel.expert, years_of_experience=10),
                Skill(name='Client-Server Architecture', proficiency=ProficiencyLevel.expert, years_of_experience=10),
                Skill(name='Legacy Platform Re-Architecture', proficiency=ProficiencyLevel.advanced, years_of_experience=5),
            ]),
            SkillCategory(category='Testing & Quality', skills=[
                Skill(name='Unit Testing', proficiency=ProficiencyLevel.expert, years_of_experience=8),
                Skill(name='TDD', proficiency=ProficiencyLevel.advanced, years_of_experience=5),
                Skill(name='Code Reviews', proficiency=ProficiencyLevel.expert, years_of_experience=8),
            ]),
            SkillCategory(category='Tools & Workflow', skills=[
                Skill(name='Git / GitHub / Bitbucket', proficiency=ProficiencyLevel.expert, years_of_experience=10),
                Skill(name='Visual Studio / VS Code', proficiency=ProficiencyLevel.expert, years_of_experience=12),
                Skill(name='Jira / Confluence', proficiency=ProficiencyLevel.advanced, years_of_experience=8),
                Skill(name='AI-Assisted Dev (AIDD)', proficiency=ProficiencyLevel.advanced, years_of_experience=2, highlighted=True),
            ]),
        ]

    async def find_projects(self) -> list[Project]:
        return [
            Project(
                id='proj-001',
                name='DevFolio',
                description='This portfolio — a polyglot full stack architecture demo',
                summary=(
                    'A developer portfolio serving the same resume data from multiple '
                    'frontend frameworks and backend languages. Shared TypeScript '
                    'interfaces enforce one contract across every implementation.'
                ),
                technologies=['Next.js', 'React', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL'],
                github_url='https://github.com/pj1227/devfolio',
                featured=True,
                start_date='2025-08',
                current=True,
                highlights=[
                    'Shared TypeScript interfaces enforce one contract across 3 frontends and 4 backends',
                    'Live /api/tech-stack endpoint proves each implementation is real',
                    'TDD from the start — tests written before implementation',
                ],
                category=ProjectCategory.web,
            ),
            Project(
                id='proj-002',
                name='WPF Weather or Not',
                description='WPF desktop weather app in C# / .NET',
                summary='A WPF desktop application demonstrating MVVM patterns with live weather data.',
                technologies=['C#', '.NET', 'WPF', 'XAML', 'MVVM'],
                github_url='https://github.com/pj1227/WPF-Weather-or-Not',
                featured=True,
                start_date='2025-08',
                current=False,
                highlights=[
                    'MVVM architecture with clean separation of concerns',
                    'Live weather API integration via C# HttpClient',
                ],
                category=ProjectCategory.other,
            ),
        ]

    async def get_database_version(self) -> str:
        return 'None (seed mode — no database connected)'

    async def get_database_name(self) -> str:
        return 'None (seed mode)'

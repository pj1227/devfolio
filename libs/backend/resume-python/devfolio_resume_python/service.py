from __future__ import annotations

from devfolio_resume_python.models import (
    Education,
    Profile,
    Project,
    SkillCategory,
    TechStackInfo,
    WorkExperience,
)
from devfolio_resume_python.repository import IResumeRepository


class ResumeService:
    def __init__(self, repository: IResumeRepository) -> None:
        self._repo = repository

    def get_profile(self) -> Profile:
        return self._repo.get_profile()

    def get_work_experience(self) -> list[WorkExperience]:
        return self._repo.get_work_experience()

    def get_education(self) -> list[Education]:
        return self._repo.get_education()

    def get_skills(self) -> list[SkillCategory]:
        return self._repo.get_skills()

    def get_projects(self) -> list[Project]:
        return self._repo.get_projects()

    def get_tech_stack(self) -> list[TechStackInfo]:
        """
        Delegates to repo but could do live runtime introspection
        (e.g. read installed package versions) in a future iteration.
        """
        return self._repo.get_tech_stack()
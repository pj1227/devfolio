from devfolio_resume_python.repository import SeedRepository, IResumeRepository
from devfolio_resume_python.models import (
    Profile, WorkExperience, Education, SkillCategory, Project, TechStackInfo
)


def test_seed_repository_satisfies_protocol():
    repo = SeedRepository()
    assert isinstance(repo, IResumeRepository)


def test_get_profile_returns_profile(repo: SeedRepository):
    profile = repo.get_profile()
    assert isinstance(profile, Profile)
    assert profile.name == "Joel Patterson"


def test_get_work_experience_returns_list(repo: SeedRepository):
    work = repo.get_work_experience()
    assert isinstance(work, list)
    assert len(work) >= 1
    assert all(isinstance(w, WorkExperience) for w in work)


def test_work_experience_current_role_has_no_end_date(repo: SeedRepository):
    work = repo.get_work_experience()
    current = work[0]
    assert current.end_date is None


def test_get_education_returns_list(repo: SeedRepository):
    edu = repo.get_education()
    assert isinstance(edu, list)
    assert all(isinstance(e, Education) for e in edu)


def test_get_skills_returns_categories(repo: SeedRepository):
    skills = repo.get_skills()
    assert isinstance(skills, list)
    assert all(isinstance(s, SkillCategory) for s in skills)
    categories = [s.category for s in skills]
    assert "Languages" in categories


def test_get_projects_returns_list(repo: SeedRepository):
    projects = repo.get_projects()
    assert isinstance(projects, list)
    assert all(isinstance(p, Project) for p in projects)


def test_get_tech_stack_returns_list(repo: SeedRepository):
    tech = repo.get_tech_stack()
    assert isinstance(tech, list)
    assert all(isinstance(t, TechStackInfo) for t in tech)


def test_tech_stack_has_expected_categories(repo: SeedRepository):
    tech = repo.get_tech_stack()
    categories = {t.category for t in tech}
    assert "frontend" in categories
    assert "backend" in categories
    assert "database" in categories
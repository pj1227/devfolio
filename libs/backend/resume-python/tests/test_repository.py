import pytest
from devfolio_resume_python.repository import SeedRepository, IResumeRepository
from devfolio_resume_python.models import (
    Profile, WorkExperience, Education, SkillCategory, Project,
)


def test_seed_repository_satisfies_protocol():
    repo = SeedRepository()
    assert isinstance(repo, IResumeRepository)


@pytest.mark.asyncio
async def test_find_profile_returns_profile(repo: SeedRepository):
    profile = await repo.find_profile()
    assert isinstance(profile, Profile)
    assert profile.name == "Joel M. Cossins"


@pytest.mark.asyncio
async def test_find_profile_has_clearance(repo: SeedRepository):
    profile = await repo.find_profile()
    assert profile.clearance == "Active Top Secret Clearance"


@pytest.mark.asyncio
async def test_find_profile_variant_fullstack(repo: SeedRepository):
    profile = await repo.find_profile(resume="fullstack")
    assert "Full Stack" in profile.summary


@pytest.mark.asyncio
async def test_find_profile_variant_dotnet(repo: SeedRepository):
    profile = await repo.find_profile(resume="dotnet")
    assert ".NET" in profile.summary or "C#" in profile.summary


@pytest.mark.asyncio
async def test_find_work_experience_returns_list(repo: SeedRepository):
    work = await repo.find_work_experience()
    assert isinstance(work, list)
    assert len(work) >= 1
    assert all(isinstance(w, WorkExperience) for w in work)


@pytest.mark.asyncio
async def test_work_experience_current_role_has_no_end_date(repo: SeedRepository):
    work = await repo.find_work_experience()
    current = next((w for w in work if w.current), None)
    assert current is not None
    assert current.end_date is None


@pytest.mark.asyncio
async def test_work_experience_highlights_vary_by_resume(repo: SeedRepository):
    fullstack = await repo.find_work_experience(resume="fullstack")
    dotnet    = await repo.find_work_experience(resume="dotnet")
    # BigBear highlights should differ between variants
    bb_fs = next(w for w in fullstack if w.company == "BigBear.ai")
    bb_dn = next(w for w in dotnet    if w.company == "BigBear.ai")
    assert bb_fs.highlights != bb_dn.highlights


@pytest.mark.asyncio
async def test_find_education_returns_list(repo: SeedRepository):
    edu = await repo.find_education()
    assert isinstance(edu, list)
    assert len(edu) >= 1
    assert all(isinstance(e, Education) for e in edu)


@pytest.mark.asyncio
async def test_education_same_across_variants(repo: SeedRepository):
    edu_fs = await repo.find_education(resume="fullstack")
    edu_dn = await repo.find_education(resume="dotnet")
    assert [e.institution for e in edu_fs] == [e.institution for e in edu_dn]


@pytest.mark.asyncio
async def test_find_skills_returns_categories(repo: SeedRepository):
    skills = await repo.find_skills()
    assert isinstance(skills, list)
    assert all(isinstance(s, SkillCategory) for s in skills)


@pytest.mark.asyncio
async def test_skills_vary_by_resume(repo: SeedRepository):
    fullstack = await repo.find_skills(resume="fullstack")
    dotnet    = await repo.find_skills(resume="dotnet")
    fs_categories = [s.category for s in fullstack]
    dn_categories = [s.category for s in dotnet]
    assert "Frontend" in fs_categories
    assert "Languages & Frameworks" in dn_categories


@pytest.mark.asyncio
async def test_find_projects_returns_list(repo: SeedRepository):
    projects = await repo.find_projects()
    assert isinstance(projects, list)
    assert len(projects) >= 1
    assert all(isinstance(p, Project) for p in projects)


@pytest.mark.asyncio
async def test_find_projects_includes_devfolio(repo: SeedRepository):
    projects = await repo.find_projects()
    names = [p.name for p in projects]
    assert "DevFolio" in names
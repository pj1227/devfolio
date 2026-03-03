import pytest
from unittest.mock import AsyncMock, MagicMock
from devfolio_resume_python.service import ResumeService
from devfolio_resume_python.models import (
    Profile, WorkExperience, Education, SkillCategory, Project,
)


@pytest.mark.asyncio
async def test_service_delegates_get_profile(service: ResumeService):
    profile = await service.get_profile()
    assert isinstance(profile, Profile)
    assert profile.name == "Joel M. Cossins"


@pytest.mark.asyncio
async def test_service_get_profile_variant(service: ResumeService):
    fs = await service.get_profile(resume="fullstack")
    dn = await service.get_profile(resume="dotnet")
    assert fs.summary != dn.summary


@pytest.mark.asyncio
async def test_service_delegates_get_work_experience(service: ResumeService):
    work = await service.get_work_experience()
    assert isinstance(work, list)
    assert len(work) >= 1


@pytest.mark.asyncio
async def test_service_delegates_get_education(service: ResumeService):
    edu = await service.get_education()
    assert isinstance(edu, list)
    assert len(edu) >= 1


@pytest.mark.asyncio
async def test_service_delegates_get_skills(service: ResumeService):
    skills = await service.get_skills()
    assert isinstance(skills, list)
    assert len(skills) >= 1


@pytest.mark.asyncio
async def test_service_delegates_get_projects(service: ResumeService):
    projects = await service.get_projects()
    assert isinstance(projects, list)
    assert len(projects) >= 1


@pytest.mark.asyncio
async def test_service_delegates_get_tech_stack(service: ResumeService):
    tech = await service.get_tech_stack()
    assert tech.runtime.name == "Python"
    assert tech.framework.name == "FastAPI"


@pytest.mark.asyncio
async def test_service_uses_injected_repository():
    """Service delegates to repo — not hardcoded data."""
    mock_repo = MagicMock()
    mock_repo.find_profile = AsyncMock(return_value=Profile(
        name="Test User",
        title="Engineer",
        summary="Test summary.",
        email="t@t.com",
        location="US",
    ))
    svc = ResumeService(mock_repo)
    result = await svc.get_profile()
    mock_repo.find_profile.assert_called_once()
    assert result.name == "Test User"


@pytest.mark.asyncio
async def test_service_passes_resume_param_to_repo():
    """Service forwards the resume variant param to the repo."""
    mock_repo = MagicMock()
    mock_repo.find_profile = AsyncMock(return_value=Profile(
        name="Test User",
        title="Engineer",
        summary="Test summary.",
        email="t@t.com",
        location="US",
    ))
    svc = ResumeService(mock_repo)
    await svc.get_profile(resume="dotnet")
    mock_repo.find_profile.assert_called_once_with("dotnet")
from unittest.mock import MagicMock
from devfolio_resume_python.service import ResumeService
from devfolio_resume_python.models import Profile


def test_service_delegates_get_profile(service: ResumeService):
    profile = service.get_profile()
    assert isinstance(profile, Profile)
    assert profile.name == "Joel Patterson"


def test_service_delegates_get_work_experience(service: ResumeService):
    work = service.get_work_experience()
    assert len(work) >= 1


def test_service_delegates_get_education(service: ResumeService):
    edu = service.get_education()
    assert len(edu) >= 1


def test_service_delegates_get_skills(service: ResumeService):
    skills = service.get_skills()
    assert len(skills) >= 1


def test_service_delegates_get_projects(service: ResumeService):
    projects = service.get_projects()
    assert len(projects) >= 1


def test_service_delegates_get_tech_stack(service: ResumeService):
    tech = service.get_tech_stack()
    assert len(tech) >= 1


def test_service_uses_injected_repository():
    """Service calls the repo — not hardcoded data."""
    mock_repo = MagicMock()
    mock_repo.get_profile.return_value = Profile(
        name="Test User",
        title="Engineer",
        email="t@t.com",
        phone="555",
        location="US",
        linkedin="https://linkedin.com",
        github="https://github.com",
        summary="Test",
    )
    svc = ResumeService(mock_repo)
    result = svc.get_profile()
    mock_repo.get_profile.assert_called_once()
    assert result.name == "Test User"
import pytest
from devfolio_resume_python.repository import SeedRepository
from devfolio_resume_python.service import ResumeService


@pytest.fixture
def repo() -> SeedRepository:
    return SeedRepository()


@pytest.fixture
def service(repo: SeedRepository) -> ResumeService:
    return ResumeService(repo)
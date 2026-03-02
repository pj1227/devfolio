import pytest
from httpx import AsyncClient, ASGITransport
from api_python.main import create_app
from devfolio_resume_python.repository import SeedRepository
from devfolio_resume_python.service import ResumeService


@pytest.fixture
def app():
    application = create_app()
    application.state.service = ResumeService(SeedRepository())
    return application


@pytest.fixture
async def client(app):
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
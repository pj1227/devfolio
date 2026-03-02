from fastapi import APIRouter, Request
from devfolio_resume_python.models import ResumeEnvelope

router = APIRouter(tags=["projects"])


@router.get("/projects", response_model=ResumeEnvelope)
async def get_projects(request: Request) -> ResumeEnvelope:
    data = request.app.state.service.get_projects()
    return ResumeEnvelope(data=data)
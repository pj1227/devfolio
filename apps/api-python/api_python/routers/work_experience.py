from fastapi import APIRouter, Request
from devfolio_resume_python.models import ResumeEnvelope

router = APIRouter(tags=["work-experience"])


@router.get("/work-experience", response_model=ResumeEnvelope)
async def get_work_experience(request: Request) -> ResumeEnvelope:
    data = request.app.state.service.get_work_experience()
    return ResumeEnvelope(data=data)
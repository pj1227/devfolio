from fastapi import APIRouter, Request
from devfolio_resume_python.models import ResumeEnvelope

router = APIRouter(tags=["skills"])


@router.get("/skills", response_model=ResumeEnvelope)
async def get_skills(request: Request) -> ResumeEnvelope:
    data = request.app.state.service.get_skills()
    return ResumeEnvelope(data=data)
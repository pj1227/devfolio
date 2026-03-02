from fastapi import APIRouter, Request
from devfolio_resume_python.models import ResumeEnvelope

router = APIRouter(tags=["education"])


@router.get("/education", response_model=ResumeEnvelope)
async def get_education(request: Request) -> ResumeEnvelope:
    data = request.app.state.service.get_education()
    return ResumeEnvelope(data=data)
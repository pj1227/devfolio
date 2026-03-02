from fastapi import APIRouter, Request
from devfolio_resume_python.models import ResumeEnvelope

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=ResumeEnvelope)
async def get_profile(request: Request) -> ResumeEnvelope:
    data = request.app.state.service.get_profile()
    return ResumeEnvelope(data=data)
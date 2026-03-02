from fastapi import APIRouter, Request
from devfolio_resume_python.models import ResumeEnvelope
from devfolio_resume_python.runtime import get_live_tech_stack

router = APIRouter(tags=["tech-stack"])


@router.get("/tech-stack", response_model=ResumeEnvelope)
async def get_tech_stack(request: Request) -> ResumeEnvelope:
    data = get_live_tech_stack()
    return ResumeEnvelope(data=data)
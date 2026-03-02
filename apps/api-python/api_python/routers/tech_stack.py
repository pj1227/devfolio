from fastapi import APIRouter, Request
from devfolio_resume_python.models import ResumeEnvelope

router = APIRouter(tags=["tech-stack"])


@router.get("/tech-stack", response_model=ResumeEnvelope)
async def get_tech_stack(request: Request) -> ResumeEnvelope:
    data = request.app.state.service.get_tech_stack()
    return ResumeEnvelope(data=data)
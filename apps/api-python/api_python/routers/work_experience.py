from fastapi import APIRouter, Query, Request
from devfolio_resume_python.models import ApiEnvelope
from devfolio_resume_python.repository import DEFAULT_RESUME

router = APIRouter(tags=["work-experience"])


@router.get("/work-experience", response_model=ApiEnvelope)
async def get_work_experience(
    request: Request,
    resume: str = Query(default=DEFAULT_RESUME, description="Resume variant (fullstack, dotnet)"),
) -> ApiEnvelope:
    data = await request.app.state.service.get_work_experience(resume=resume)
    return ApiEnvelope(data=data)
from fastapi import APIRouter, Query, Request
from devfolio_resume_python.models import ApiEnvelope
from devfolio_resume_python.repository import DEFAULT_RESUME

router = APIRouter(tags=["skills"])


@router.get("/skills", response_model=ApiEnvelope)
async def get_skills(
    request: Request,
    resume: str = Query(default=DEFAULT_RESUME, description="Resume variant (fullstack, dotnet)"),
) -> ApiEnvelope:
    data = await request.app.state.service.get_skills(resume=resume)
    return ApiEnvelope(data=data)
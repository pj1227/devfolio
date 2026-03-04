from fastapi import APIRouter, Query, Request
from devfolio_resume_python.models import ApiEnvelope
from devfolio_resume_python.repository import DEFAULT_RESUME

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=ApiEnvelope)
async def get_profile(
    request: Request,
    resume: str = Query(default=DEFAULT_RESUME, description="Resume variant (fullstack, dotnet)"),
) -> ApiEnvelope:
    data = await request.app.state.service.get_profile(resume=resume)
    return ApiEnvelope(data=data)
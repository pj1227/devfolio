from fastapi import APIRouter, Query, Request
from devfolio_resume_python.models import ApiEnvelope
from devfolio_resume_python.repository import DEFAULT_RESUME

router = APIRouter(tags=["projects"])


@router.get("/projects", response_model=ApiEnvelope)
async def get_projects(
    request: Request,
    resume: str = Query(default=DEFAULT_RESUME, description="Resume variant (fullstack, dotnet)"),
) -> ApiEnvelope:
    data = await request.app.state.service.get_projects(resume=resume)
    return ApiEnvelope(data=data)
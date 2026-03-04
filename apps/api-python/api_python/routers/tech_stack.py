from fastapi import APIRouter, Request
from devfolio_resume_python.models import ApiEnvelope

router = APIRouter(tags=["tech-stack"])


@router.get("/tech-stack", response_model=ApiEnvelope)
async def get_tech_stack(request: Request) -> ApiEnvelope:
    # tech-stack is live runtime introspection — not resume-variant-dependent
    data = await request.app.state.service.get_tech_stack()
    return ApiEnvelope(data=data)
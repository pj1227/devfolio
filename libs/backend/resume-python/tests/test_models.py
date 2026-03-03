import pytest
from pydantic import ValidationError
from devfolio_resume_python.models import (
    Profile,
    WorkExperience,
    Education,
    Skill,
    SkillCategory,
    Project,
    ProjectCategory,
    TechStackInfo,
    RuntimeInfo,
    FrameworkInfo,
    DatabaseInfo,
    DatabaseDialect,
    OsInfo,
    EnvironmentInfo,
    PackageInfo,
    ApiResponse,
    ApiMeta,
    StackIdentifier,
)
from datetime import datetime, timezone


# ── Profile ───────────────────────────────────────────────────────────────────

def test_profile_creates_successfully():
    p = Profile(
        name="Joel M. Cossins",
        title="Software Developer",
        clearance="Active Top Secret Clearance",
        summary="A great engineer.",
        email="joel1227@proton.me",
        location="Libby, MT, US",
        github="https://github.com/pj1227",
        linkedin="https://www.linkedin.com/in/joel-cossins-1077384/",
    )
    assert p.name == "Joel M. Cossins"
    assert p.clearance == "Active Top Secret Clearance"


def test_profile_camel_alias():
    """Fields serialize to camelCase."""
    p = Profile(
        name="Joel M. Cossins",
        title="Software Developer",
        summary="A great engineer.",
        email="joel1227@proton.me",
        location="Libby, MT, US",
    )
    dumped = p.model_dump(by_alias=True)
    assert "name" in dumped
    assert "title" in dumped
    assert "avatarUrl" in dumped  # snake_case → camelCase


def test_profile_missing_required_field_raises():
    with pytest.raises(ValidationError):
        Profile(name="Joel")  # type: ignore


def test_profile_clearance_optional():
    p = Profile(
        name="Joel M. Cossins",
        title="Software Developer",
        summary="Summary.",
        email="joel1227@proton.me",
        location="Libby, MT, US",
    )
    assert p.clearance is None


# ── WorkExperience ────────────────────────────────────────────────────────────

def test_work_experience_creates_successfully():
    we = WorkExperience(
        id="we-001",
        company="Acme",
        title="Engineer",
        location="Remote",
        start_date="2020-01",
        end_date=None,
        current=True,
        summary="Did great work.",
        highlights=["Built things"],
        technologies=["Python"],
    )
    assert we.company == "Acme"
    assert we.end_date is None
    assert we.current is True


def test_work_experience_optional_end_date():
    we = WorkExperience(
        id="we-001",
        company="Acme",
        title="Engineer",
        location="Remote",
        start_date="2020-01",
        end_date=None,
        current=True,
        summary="",
        highlights=[],
        technologies=[],
    )
    assert we.end_date is None


def test_work_experience_camel_case_output():
    we = WorkExperience(
        id="we-001",
        company="Acme",
        title="Engineer",
        location="Remote",
        start_date="2020-01",
        current=True,
        summary="",
        highlights=[],
        technologies=[],
    )
    dumped = we.model_dump(by_alias=True)
    assert "startDate" in dumped
    assert "companyUrl" in dumped


# ── Skills ────────────────────────────────────────────────────────────────────

def test_skill_category_contains_skills():
    sc = SkillCategory(
        category="Languages",
        skills=[Skill(name="Python", proficiency="expert")],
    )
    assert len(sc.skills) == 1
    assert sc.skills[0].name == "Python"


def test_skill_proficiency_levels():
    for level in ("beginner", "intermediate", "advanced", "expert"):
        s = Skill(name="Test", proficiency=level)
        assert s.proficiency == level


# ── Project ───────────────────────────────────────────────────────────────────

def test_project_creates_successfully():
    p = Project(
        id="proj-001",
        name="DevFolio",
        description="A portfolio app",
        summary="Full summary here.",
        technologies=["Python", "FastAPI"],
        featured=True,
        start_date="2025-08",
        current=True,
        highlights=["TDD from the start"],
        category=ProjectCategory.web,
    )
    assert p.name == "DevFolio"
    assert p.github_url is None
    assert p.live_url is None


def test_project_optional_urls():
    p = Project(
        id="proj-001",
        name="DevFolio",
        description="A portfolio app",
        summary="Summary.",
        technologies=[],
        featured=False,
        start_date="2025-08",
        current=False,
        highlights=[],
        category=ProjectCategory.web,
    )
    assert p.github_url is None
    assert p.live_url is None


# ── TechStackInfo ─────────────────────────────────────────────────────────────

def _make_tech_stack_info(**kwargs) -> TechStackInfo:
    defaults = dict(
        generated_at=datetime.now(timezone.utc).isoformat(),
        runtime=RuntimeInfo(name="Python", version="3.12.3", implementation="CPython"),
        framework=FrameworkInfo(name="FastAPI", version="0.115.0"),
        database=DatabaseInfo(
            name="None (seed mode)",
            version="None",
            dialect=DatabaseDialect.postgres,
            connected=False,
        ),
        os=OsInfo(platform="Linux", release="6.6.0", architecture="aarch64"),
        environment=EnvironmentInfo(name="development", timezone="UTC"),
        packages=[PackageInfo(name="fastapi", version="0.115.0", category="http")],
    )
    defaults.update(kwargs)
    return TechStackInfo(**defaults)


def test_tech_stack_info_creates_successfully():
    t = _make_tech_stack_info()
    assert t.runtime.name == "Python"
    assert t.framework.name == "FastAPI"
    assert t.database.connected is False


def test_tech_stack_info_camel_case_output():
    t = _make_tech_stack_info()
    dumped = t.model_dump(by_alias=True)
    assert "generatedAt" in dumped
    assert "runtime" in dumped
    assert "framework" in dumped


def test_tech_stack_info_packages_list():
    t = _make_tech_stack_info(packages=[
        PackageInfo(name="fastapi", version="0.115.0", category="http"),
        PackageInfo(name="pydantic", version="2.9.0", category="validation"),
    ])
    assert len(t.packages) == 2


# ── ApiResponse ───────────────────────────────────────────────────────────────

def test_api_response_wraps_data():
    meta = ApiMeta(
        timestamp=datetime.now(timezone.utc).isoformat(),
        stack=StackIdentifier(backend="FastAPI/Python", database="seed"),
        duration_ms=1.5,
    )
    env = ApiResponse(data={"key": "value"}, meta=meta)
    assert env.data == {"key": "value"}
    assert env.meta.stack.backend == "FastAPI/Python"
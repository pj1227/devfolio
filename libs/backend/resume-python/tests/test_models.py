import pytest
from pydantic import ValidationError
from devfolio_resume_python.models import (
    Profile,
    WorkExperience,
    Education,
    Skill,
    SkillCategory,
    Project,
    TechStackInfo,
    ResumeEnvelope,
)


def test_profile_creates_successfully():
    p = Profile(
        name="Joel Patterson",
        title="Senior Software Engineer",
        email="test@test.com",
        phone="555-0000",
        location="US",
        linkedin="https://linkedin.com/in/test",
        github="https://github.com/test",
        summary="A great engineer.",
    )
    assert p.name == "Joel Patterson"


def test_profile_camel_alias():
    """Fields serialize to camelCase."""
    p = Profile(
        name="Joel Patterson",
        title="Senior Software Engineer",
        email="test@test.com",
        phone="555-0000",
        location="US",
        linkedin="https://linkedin.com/in/test",
        github="https://github.com/test",
        summary="A great engineer.",
    )
    dumped = p.model_dump(by_alias=True)
    # snake_case fields that have no underscore stay the same
    assert "name" in dumped
    assert "title" in dumped


def test_profile_missing_required_field_raises():
    with pytest.raises(ValidationError):
        Profile(name="Joel")  # type: ignore


def test_work_experience_optional_end_date():
    we = WorkExperience(
        company="Acme",
        title="Engineer",
        start_date="2020-01",
        end_date=None,
        location="Remote",
        highlights=["Did things"],
    )
    assert we.end_date is None


def test_skill_category_contains_skills():
    sc = SkillCategory(
        category="Languages",
        skills=[Skill(name="Python", proficiency="expert")],
    )
    assert len(sc.skills) == 1
    assert sc.skills[0].name == "Python"


def test_project_defaults():
    p = Project(
        name="DevFolio",
        description="A portfolio app",
        tech_stack=["Python"],
    )
    assert p.url is None
    assert p.highlights == []


def test_tech_stack_info_related_defaults_empty():
    t = TechStackInfo(name="FastAPI", category="backend")
    assert t.related == []
    assert t.years_experience is None


def test_resume_envelope_wraps_data():
    env = ResumeEnvelope(data={"key": "value"})
    assert env.data == {"key": "value"}
    assert env.version == "1.0"


def test_tech_stack_info_meta_defaults_empty():
    t = TechStackInfo(name="FastAPI", category="framework")
    assert t.meta == {}


def test_tech_stack_info_accepts_meta():
    t = TechStackInfo(name="Python", category="runtime", meta={"version": "3.12.3"})
    assert t.meta["version"] == "3.12.3"
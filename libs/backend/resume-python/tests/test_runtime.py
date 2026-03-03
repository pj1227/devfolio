import sys
import platform
from devfolio_resume_python.runtime import get_live_tech_stack
from devfolio_resume_python.models import TechStackInfo


def test_get_live_tech_stack_returns_tech_stack_info():
    result = get_live_tech_stack()
    assert isinstance(result, TechStackInfo)


def test_live_tech_stack_has_python_runtime():
    result = get_live_tech_stack()
    assert result.runtime.name == "Python"


def test_live_python_version_matches_runtime():
    result = get_live_tech_stack()
    expected = sys.version.split()[0]
    assert result.runtime.version == expected


def test_live_tech_stack_has_fastapi_framework():
    result = get_live_tech_stack()
    assert result.framework.name == "FastAPI"


def test_live_tech_stack_has_os_info():
    result = get_live_tech_stack()
    assert result.os.platform == platform.system()
    assert result.os.architecture == platform.machine()


def test_live_tech_stack_has_packages():
    result = get_live_tech_stack()
    assert len(result.packages) > 0
    package_names = [p.name for p in result.packages]
    assert "fastapi" in package_names
    assert "pydantic" in package_names


def test_live_tech_stack_has_generated_at():
    result = get_live_tech_stack()
    assert result.generated_at is not None
    assert len(result.generated_at) > 0
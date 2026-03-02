import sys
import platform
from devfolio_resume_python.runtime import get_live_tech_stack
from devfolio_resume_python.models import TechStackInfo


def test_get_live_tech_stack_returns_list():
    result = get_live_tech_stack()
    assert isinstance(result, list)
    assert len(result) > 0
    assert all(isinstance(t, TechStackInfo) for t in result)


def test_live_tech_stack_has_python_entry():
    result = get_live_tech_stack()
    names = [t.name for t in result]
    assert "Python" in names


def test_live_python_version_matches_runtime():
    result = get_live_tech_stack()
    python_entry = next(t for t in result if t.name == "Python")
    assert sys.version in python_entry.meta["version"]


def test_live_tech_stack_has_os_entry():
    result = get_live_tech_stack()
    os_entry = next(t for t in result if t.name == "OS")
    assert os_entry.meta["system"] == platform.system()


def test_all_entries_have_category():
    result = get_live_tech_stack()
    assert all(t.category for t in result)
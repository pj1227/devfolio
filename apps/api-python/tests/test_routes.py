import pytest


async def test_get_profile(client):
    response = await client.get("/profile")
    assert response.status_code == 200
    body = response.json()
    assert "data" in body
    assert body["data"]["name"] == "Joel M. Cossins"


async def test_get_work_experience(client):
    response = await client.get("/work-experience")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["data"], list)
    assert len(body["data"]) >= 1


async def test_get_education(client):
    response = await client.get("/education")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["data"], list)


async def test_get_skills(client):
    response = await client.get("/skills")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["data"], list)
    categories = [s["category"] for s in body["data"]]
    assert "Frontend" in categories


async def test_get_projects(client):
    response = await client.get("/projects")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["data"], list)


async def test_get_tech_stack(client):
    response = await client.get("/tech-stack")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["data"], list)


async def test_envelope_has_version(client):
    response = await client.get("/profile")
    body = response.json()
    assert body["version"] == "1.0"
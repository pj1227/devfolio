FROM python:3.12-slim

WORKDIR /app

ENV UV_PYTHON_PREFERENCE=system
ENV UV_PYTHON=python3.12

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy the lib first (it's a local dependency)
COPY libs/backend/resume-python /app/libs/backend/resume-python

# Copy the app
COPY apps/api-python /app/apps/api-python

# Install dependencies (no dev deps)
WORKDIR /app/apps/api-python
RUN uv sync --no-dev --python python3.12

# Run with uvicorn
CMD ["uv", "run", "uvicorn", "api_python.main:app", "--host", "0.0.0.0", "--port", "8000"]
-- DevFolio Resume Schema
-- Run this in the Supabase SQL editor before first startup.
-- All tables use resume_variant as a discriminator so a single DB
-- holds all variants (fullstack, dotnet, etc.)

-- ── Resumes (variant registry) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
    id          SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,  -- 'fullstack', 'dotnet', etc.
    label       TEXT NOT NULL,         -- 'Full Stack', '.NET', etc.
    is_default  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Profiles ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    id          SERIAL PRIMARY KEY,
    resume_slug TEXT NOT NULL REFERENCES resumes(slug) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    title       TEXT NOT NULL,
    clearance   TEXT,
    summary     TEXT NOT NULL,
    email       TEXT NOT NULL,
    location    TEXT NOT NULL,
    github      TEXT,
    linkedin    TEXT,
    website     TEXT,
    avatar_url  TEXT,
    UNIQUE (resume_slug)
);

-- ── Work Experience ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
    id          SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,  -- 'we-bigbear', 'we-dte', etc.
    name        TEXT NOT NULL,
    location    TEXT NOT NULL DEFAULT '',
    company_url TEXT
);

CREATE TABLE IF NOT EXISTS roles (
    id          SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,  -- 'role-bigbear-swd', etc.
    company_slug TEXT NOT NULL REFERENCES companies(slug) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    start_date  TEXT NOT NULL,
    end_date    TEXT,                  -- NULL = current role
    sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS highlights (
    id          SERIAL PRIMARY KEY,
    role_slug   TEXT NOT NULL REFERENCES roles(slug) ON DELETE CASCADE,
    resume_slug TEXT NOT NULL REFERENCES resumes(slug) ON DELETE CASCADE,
    body        TEXT NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    UNIQUE (role_slug, resume_slug, sort_order)
);

-- ── Education ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
    id          SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    institution TEXT NOT NULL,
    degree      TEXT NOT NULL,
    field       TEXT NOT NULL,
    start_date  TEXT NOT NULL,
    end_date    TEXT,
    sort_order  INT NOT NULL DEFAULT 0
);

-- ── Skills ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_categories (
    id          SERIAL PRIMARY KEY,
    resume_slug TEXT NOT NULL REFERENCES resumes(slug) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    UNIQUE (resume_slug, name)
);

CREATE TABLE IF NOT EXISTS skills (
    id                  SERIAL PRIMARY KEY,
    category_id         INT NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    name                TEXT NOT NULL,
    note                TEXT,
    proficiency         TEXT NOT NULL DEFAULT 'intermediate',
    years_of_experience INT,
    highlighted         BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order          INT NOT NULL DEFAULT 0
);

-- ── Projects ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id           SERIAL PRIMARY KEY,
    slug         TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL,
    description  TEXT NOT NULL,
    summary      TEXT NOT NULL DEFAULT '',
    github_url   TEXT,
    live_url     TEXT,
    featured     BOOLEAN NOT NULL DEFAULT FALSE,
    start_date   TEXT NOT NULL,
    current      BOOLEAN NOT NULL DEFAULT FALSE,
    category     TEXT NOT NULL DEFAULT 'web',
    sort_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_technologies (
    id         SERIAL PRIMARY KEY,
    project_slug TEXT NOT NULL REFERENCES projects(slug) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_highlights (
    id           SERIAL PRIMARY KEY,
    project_slug TEXT NOT NULL REFERENCES projects(slug) ON DELETE CASCADE,
    body         TEXT NOT NULL,
    sort_order   INT NOT NULL DEFAULT 0
);

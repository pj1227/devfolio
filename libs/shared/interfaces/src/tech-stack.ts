/**
 * @file tech-stack.ts
 * @description Types for the GET /api/tech-stack endpoint.
 *
 * This is the "phpinfo() for every tech" feature.
 * Every field must come from live runtime introspection —
 * no hardcoded values allowed. That's what proves each
 * stack implementation is real.
 */

// ── Runtime ───────────────────────────────────────────────────────────────────

export interface RuntimeInfo {
  name: string;            // "Python", "Node.js", "PHP", "Ruby", "C#"
  version: string;         // "3.12.3"
  implementation?: string; // "CPython", "V8", "Mono", etc.
}

// ── Framework ─────────────────────────────────────────────────────────────────

export interface FrameworkInfo {
  name: string;            // "FastAPI", "Laravel", "Rails", "ASP.NET Core"
  version: string;         // "0.115.4"
  extra?: Record<string, string>; // e.g. { uvicorn: "0.32.0", pydantic: "2.9.2" }
}

// ── Database ──────────────────────────────────────────────────────────────────

export type DatabaseDialect =
  | 'postgres'
  | 'mysql'
  | 'mssql'
  | 'sqlite'
  | 'mongodb';

export interface DatabaseInfo {
  name: string;            // "PostgreSQL"
  version: string;         // live from SELECT version()
  dialect: DatabaseDialect;
  connected: boolean;      // false = running in seed/fallback mode
}

// ── Operating System ──────────────────────────────────────────────────────────

export interface OsInfo {
  platform: string;        // "Linux"
  release: string;         // kernel version string
  architecture: string;    // "x86_64"
}

// ── Environment ───────────────────────────────────────────────────────────────

export interface EnvironmentInfo {
  name: string;            // "development" | "staging" | "production"
  timezone: string;        // "UTC"
}

// ── Packages ──────────────────────────────────────────────────────────────────

export interface PackageInfo {
  name: string;
  version: string;
  category?: string;       // "http", "orm", "testing", etc.
}

// ── Composed type ─────────────────────────────────────────────────────────────

export interface TechStackInfo {
  generatedAt: string;     // ISO 8601 — proves the data is live, not cached
  runtime: RuntimeInfo;
  framework: FrameworkInfo;
  database: DatabaseInfo;
  os: OsInfo;
  environment: EnvironmentInfo;
  packages: PackageInfo[];
}

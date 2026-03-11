/**
 * @file validators.ts
 * @description Runtime type guards for all shared interfaces.
 *
 * These functions let any layer (frontend, backend, tests) verify
 * at runtime that an unknown value satisfies a known interface shape.
 *
 * This is the file that makes the Phase 1a tests pass (RED → GREEN).
 *
 * Usage:
 *   import { isProfile } from '@devfolio/shared-interfaces';
 *   if (isProfile(data)) { ... } // TypeScript now knows data is Profile
 */

import type {
  Profile,
  WorkExperience,
} from './domain';

import type { TechStackInfo as TechStack } from './tech-stack';

// ── Internal helpers ──────────────────────────────────────────────────────────
// Not exported — used only within this file.

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasString(obj: Record<string, unknown>, key: string): boolean {
  return typeof obj[key] === 'string' && (obj[key] as string).length > 0;
}

// ── Enum validators ───────────────────────────────────────────────────────────

const PROFICIENCY_LEVELS = [
  'beginner', 'intermediate', 'advanced', 'expert',
] as const;

const PROJECT_CATEGORIES = [
  'web', 'api', 'cli', 'library', 'mobile', 'devops', 'data', 'other',
] as const;

const DB_DIALECTS = [
  'postgres', 'mysql', 'mssql', 'sqlite', 'mongodb',
] as const;

export function isValidProficiencyLevel(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    PROFICIENCY_LEVELS.includes(value as typeof PROFICIENCY_LEVELS[number])
  );
}

export function isValidProjectCategory(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    PROJECT_CATEGORIES.includes(value as typeof PROJECT_CATEGORIES[number])
  );
}

export function isValidDatabaseDialect(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    DB_DIALECTS.includes(value as typeof DB_DIALECTS[number])
  );
}

// ── Interface type guards ─────────────────────────────────────────────────────

/**
 * isProfile — checks that value has all required Profile fields.
 * Optional fields (github, linkedin, etc.) are not checked —
 * their absence is valid.
 */
export function isProfile(value: unknown): value is Profile {
  if (!isObject(value)) return false;
  return (
    hasString(value, 'name') &&
    hasString(value, 'title') &&
    hasString(value, 'summary') &&
    hasString(value, 'email') &&
    hasString(value, 'location')
  );
}

/**
 * isWorkExperience — checks required fields including array types.
 * Note: endDate is optional (absent when current === true), so
 * we only check that current is boolean, not that endDate exists.
 */
export function isWorkExperience(value: unknown): value is WorkExperience {
  if (!isObject(value)) return false;
  return (
    hasString(value, 'id') &&
    hasString(value, 'company') &&
    hasString(value, 'title') &&
    hasString(value, 'location') &&
    hasString(value, 'startDate') &&
    typeof value['current'] === 'boolean' &&
    hasString(value, 'summary') &&
    Array.isArray(value['highlights']) &&
    Array.isArray(value['technologies'])
  );
}

/**
 * isTechStackInfo — checks the full nested structure.
 * database.connected must be explicitly present as a boolean —
 * this is what proves the backend actually reached the database.
 */
export function isTechStackInfo(value: unknown): value is TechStack {
  if (!isObject(value)) return false;

  const db = value['database'];

  return (
    hasString(value, 'generatedAt') &&
    isObject(value['runtime']) &&
    isObject(value['framework']) &&
    isObject(db) &&
    typeof (db as Record<string, unknown>)['connected'] === 'boolean' &&
    isObject(value['os']) &&
    isObject(value['environment']) &&
    Array.isArray(value['packages'])
  );
}

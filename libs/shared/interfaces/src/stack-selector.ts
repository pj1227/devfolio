/**
 * Stack selector shared TypeScript interfaces.
 * Used by @devfolio/shared-ui, @devfolio/shared-hooks, and all frontend apps.
 */

// ─── Segment identifiers ─────────────────────────────────────────────────────

export type FrontendKey = 'react' | 'next' | 'angular' | 'vue' | 'remix' | 'astro' | 'svelte';
export type BackendKey = 'fastapi' | 'rails' | 'django' | 'flask' | 'laravel' | 'aspnet' | 'express';
export type QueryKey = 'rest' | 'graphql';
export type DatabaseKey = 'postgres' | 'mysql' | 'sqlite' | 'mssql' | 'mongodb' | 'redis';

// ─── Availability ─────────────────────────────────────────────────────────────

export type AvailabilityStatus = 'available' | 'coming-soon';

export interface PhaseInfo {
  /** e.g. "Ph3", "Ph4" */
  badge: string;
  /** e.g. 3 */
  number: number;
}

// ─── Option shape ─────────────────────────────────────────────────────────────

export interface StackOption<K extends string = string> {
  key: K;
  label: string;
  /** Short label for tight spaces (e.g. segment button) */
  shortLabel?: string;
  status: AvailabilityStatus;
  /** Only set when status === 'coming-soon' */
  phase?: PhaseInfo;
  /** API base URL — only set when status === 'available' */
  apiBaseUrl?: string;
  /** Icon identifier (maps to icon registry in shared-ui) */
  icon?: string;
}

// ─── Full selector state ──────────────────────────────────────────────────────

export interface StackSelection {
  frontend: FrontendKey;
  backend: BackendKey;
  query: QueryKey;
  database: DatabaseKey;
}

export interface StackSelectorState {
  selection: StackSelection;
  /** Derived from selected backend option */
  apiBaseUrl: string;
}

// ─── Segment config passed to the UI ─────────────────────────────────────────

export interface StackSegment<K extends string = string> {
  id: keyof StackSelection;
  label: string;
  options: StackOption<K>[];
}

// ─── URL param keys ───────────────────────────────────────────────────────────

export const STACK_PARAM_KEYS = {
  frontend: 'frontend',
  backend: 'backend',
  query: 'query',
  database: 'database',
} as const satisfies Record<keyof StackSelection, string>;

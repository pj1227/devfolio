/**
 * @file stack-selector.ts
 * @description Types that drive the /stack page UI.
 *
 * StackOption<T> represents one tile in the picker.
 * `available: false` renders as "Coming Soon — Phase N".
 * `available: true` means the tile is clickable and wired to a real service.
 *
 * Adding a new stack = add a StackOption entry in shared/models/src/index.ts
 * and flip available to true when the phase is complete.
 */

export type FrontendStack = 'next' | 'nuxt' | 'angular';
export type BackendStack  = 'fastapi' | 'laravel' | 'rails' | 'aspnet';
export type DatabaseStack = 'postgres' | 'mysql' | 'mssql' | 'mongodb';

export interface StackOption<T extends string> {
  value: T;
  label: string;        // "Next.js", "FastAPI", "PostgreSQL"
  version: string;      // "15.x", "0.115.x", "17.x"
  language: string;     // "TypeScript", "Python", "SQL"
  phase: number;        // which phase unlocks this option
  available: boolean;
  apiBaseUrl?: string;  // only set when available === true
}

export interface StackSelection {
  frontend: FrontendStack;
  backend: BackendStack;
  database: DatabaseStack;
}

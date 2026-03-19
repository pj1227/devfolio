/**
 * Stack option data for all four selector segments.
 * Source of truth for what's available vs coming-soon.
 *
 * @devfolio/shared-models
 */

import type {
  StackOption,
  StackSegment,
  FrontendKey,
  BackendKey,
  QueryKey,
  DatabaseKey,
  StackSelection,
} from '@devfolio/shared-interfaces';

// ─── Frontend options ─────────────────────────────────────────────────────────

export const FRONTEND_OPTIONS: StackOption<FrontendKey>[] = [
  {
    key: 'react',
    label: 'React + Vite',
    shortLabel: 'React',
    status: 'available',
    icon: 'react',
  },
  {
    key: 'next',
    label: 'Next.js',
    shortLabel: 'Next',
    status: 'coming-soon',
    phase: { badge: 'Ph3', number: 3 },
    icon: 'next',
  },
  {
    key: 'angular',
    label: 'Angular',
    shortLabel: 'Angular',
    status: 'coming-soon',
    phase: { badge: 'Ph4', number: 4 },
    icon: 'angular',
  },
  {
    key: 'vue',
    label: 'Vue / Nuxt',
    shortLabel: 'Vue',
    status: 'coming-soon',
    phase: { badge: 'Ph5', number: 5 },
    icon: 'vue',
  },
  {
    key: 'svelte',
    label: 'SvelteKit',
    shortLabel: 'Svelte',
    status: 'coming-soon',
    phase: { badge: 'Ph10', number: 10 },
    icon: 'svelte',
  },
];

// ─── Backend options ──────────────────────────────────────────────────────────

export const BACKEND_OPTIONS: StackOption<BackendKey>[] = [
  {
    key: 'fastapi',
    label: 'FastAPI + Python',
    shortLabel: 'FastAPI',
    status: 'available',
    apiBaseUrl: 'https://api.joelcossins.dev',
    icon: 'fastapi',
  },
  {
    key: 'rails',
    label: 'Rails + Ruby',
    shortLabel: 'Rails',
    status: 'available',
    apiBaseUrl: 'https://api-rails.joelcossins.dev',
    icon: 'rails',
  },
  {
    key: 'django',
    label: 'Django REST',
    shortLabel: 'Django',
    status: 'coming-soon',
    phase: { badge: 'Ph6', number: 6 },
    icon: 'django',
  },
  {
    key: 'flask',
    label: 'Flask',
    shortLabel: 'Flask',
    status: 'coming-soon',
    phase: { badge: 'Ph6', number: 6 },
    icon: 'flask',
  },
  {
    key: 'laravel',
    label: 'Laravel + PHP',
    shortLabel: 'Laravel',
    status: 'coming-soon',
    phase: { badge: 'Ph7', number: 7 },
    icon: 'laravel',
  },
  {
    key: 'aspnet',
    label: 'ASP.NET Core',
    shortLabel: 'ASP.NET',
    status: 'coming-soon',
    phase: { badge: 'Ph8', number: 8 },
    icon: 'aspnet',
  },
  {
    key: 'express',
    label: 'Express + Node',
    shortLabel: 'Express',
    status: 'coming-soon',
    phase: { badge: 'Ph8', number: 8 },
    icon: 'express',
  },
];

// ─── Query options ────────────────────────────────────────────────────────────

export const QUERY_OPTIONS: StackOption<QueryKey>[] = [
  {
    key: 'rest',
    label: 'REST',
    shortLabel: 'REST',
    status: 'available',
    icon: 'rest',
  },
  {
    key: 'graphql',
    label: 'GraphQL',
    shortLabel: 'GQL',
    status: 'coming-soon',
    phase: { badge: 'Ph3', number: 3 },
    icon: 'graphql',
  },
];

// ─── Database options ─────────────────────────────────────────────────────────

export const DATABASE_OPTIONS: StackOption<DatabaseKey>[] = [
  {
    key: 'postgres',
    label: 'PostgreSQL',
    shortLabel: 'Postgres',
    status: 'available',
    icon: 'postgres',
  },
  {
    key: 'mysql',
    label: 'MySQL',
    shortLabel: 'MySQL',
    status: 'coming-soon',
    phase: { badge: 'Ph8', number: 8 },
    icon: 'mysql',
  },
  {
    key: 'mongodb',
    label: 'MongoDB',
    shortLabel: 'Mongo',
    status: 'coming-soon',
    phase: { badge: 'Ph8', number: 8 },
    icon: 'mongodb',
  },
  {
    key: 'redis',
    label: 'Redis',
    shortLabel: 'Redis',
    status: 'coming-soon',
    phase: { badge: 'Ph11', number: 11 },
    icon: 'redis',
  },
];

// ─── Ordered segment config ───────────────────────────────────────────────────

export const STACK_SEGMENTS: StackSegment[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    options: FRONTEND_OPTIONS,
  },
  {
    id: 'backend',
    label: 'Backend',
    options: BACKEND_OPTIONS,
  },
  {
    id: 'query',
    label: 'Query',
    options: QUERY_OPTIONS,
  },
  {
    id: 'database',
    label: 'Database',
    options: DATABASE_OPTIONS,
  },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_STACK_SELECTION: StackSelection = {
  frontend: 'react',
  backend: 'fastapi',
  query: 'rest',
  database: 'postgres',
};

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getBackendOption(key: BackendKey): StackOption<BackendKey> | undefined {
  return BACKEND_OPTIONS.find((o) => o.key === key);
}

export function getApiBaseUrl(backendKey: BackendKey): string {
  const opt = getBackendOption(backendKey);
  if (!opt || opt.status !== 'available' || !opt.apiBaseUrl) {
    // Fallback to FastAPI — should never happen in practice
    return 'https://api.joelcossins.dev';
  }
  return opt.apiBaseUrl;
}

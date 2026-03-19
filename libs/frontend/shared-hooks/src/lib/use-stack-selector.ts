/**
 * useStackSelector
 *
 * Manages the four-segment stack selection state and persists it to URL
 * query params so the user can share / bookmark their chosen stack.
 *
 * URL params: ?frontend=react&backend=rails&query=rest&database=postgres
 *
 * @devfolio/shared-hooks
 */

import { useCallback, useEffect, useState } from 'react';
import type {
  BackendKey,
  DatabaseKey,
  FrontendKey,
  QueryKey,
  StackSelection,
  StackSelectorState,
} from '@devfolio/shared-interfaces';
import {
  DEFAULT_STACK_SELECTION,
  FRONTEND_OPTIONS,
  BACKEND_OPTIONS,
  QUERY_OPTIONS,
  DATABASE_OPTIONS,
  getApiBaseUrl,
  STACK_SEGMENTS,
} from '@devfolio/shared-models';

// ─── URL param helpers ────────────────────────────────────────────────────────

function readSearchParam<T extends string>(
  params: URLSearchParams,
  key: string,
  validValues: readonly T[],
  fallback: T
): T {
  const raw = params.get(key);
  return raw && (validValues as readonly string[]).includes(raw)
    ? (raw as T)
    : fallback;
}

function selectionFromUrl(search: string): StackSelection {
  const params = new URLSearchParams(search);

  const frontendKeys = FRONTEND_OPTIONS.map((o) => o.key) as FrontendKey[];
  const backendKeys = BACKEND_OPTIONS.map((o) => o.key) as BackendKey[];
  const queryKeys = QUERY_OPTIONS.map((o) => o.key) as QueryKey[];
  const databaseKeys = DATABASE_OPTIONS.map((o) => o.key) as DatabaseKey[];

  return {
    frontend: readSearchParam(params, 'frontend', frontendKeys, DEFAULT_STACK_SELECTION.frontend),
    backend: readSearchParam(params, 'backend', backendKeys, DEFAULT_STACK_SELECTION.backend),
    query: readSearchParam(params, 'query', queryKeys, DEFAULT_STACK_SELECTION.query),
    database: readSearchParam(params, 'database', databaseKeys, DEFAULT_STACK_SELECTION.database),
  };
}

function selectionToUrl(sel: StackSelection): string {
  const params = new URLSearchParams({
    frontend: sel.frontend,
    backend: sel.backend,
    query: sel.query,
    database: sel.database,
  });
  return `?${params.toString()}`;
}

// ─── Derived state builder ────────────────────────────────────────────────────

function buildState(selection: StackSelection): StackSelectorState {
  return {
    selection,
    apiBaseUrl: getApiBaseUrl(selection.backend),
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseStackSelectorReturn {
  state: StackSelectorState;
  /** Change a single segment */
  setSegment: <K extends keyof StackSelection>(
    segment: K,
    value: StackSelection[K]
  ) => void;
  /** Reset to defaults */
  reset: () => void;
  /** All segment configs (for rendering) */
  segments: typeof STACK_SEGMENTS;
}

export function useStackSelector(): UseStackSelectorReturn {
  const [selection, setSelection] = useState<StackSelection>(() =>
    selectionFromUrl(window.location.search)
  );

  // Sync URL → state on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setSelection(selectionFromUrl(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state → URL on each selection change
  useEffect(() => {
    const newUrl = selectionToUrl(selection);
    const currentSearch = window.location.search;
    // Avoid pushing duplicate history entries
    if (newUrl !== currentSearch) {
      window.history.pushState({}, '', newUrl);
    }
  }, [selection]);

  const setSegment = useCallback(
    <K extends keyof StackSelection>(segment: K, value: StackSelection[K]) => {
      setSelection((prev) => ({ ...prev, [segment]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setSelection(DEFAULT_STACK_SELECTION);
  }, []);

  return {
    state: buildState(selection),
    setSegment,
    reset,
    segments: STACK_SEGMENTS,
  };
}

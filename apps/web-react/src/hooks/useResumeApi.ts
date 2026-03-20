/**
 * useResumeApi
 *
 * Fetches resume data from the currently selected backend.
 * API base URL is driven by the stack selector state.
 * extraParams are appended as query string params (e.g. ?resume=fullstack).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'unavailable';

export interface UseResumeApiOptions {
  apiBaseUrl: string;
  path?: string;
  /** Extra query params appended to every request, e.g. { resume: 'fullstack' } */
  extraParams?: Record<string, string>;
  autoFetch?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface UseResumeApiReturn<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
  refetch: () => void;
  retryCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PATH = '/profile';
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1200;
const REQUEST_TIMEOUT_MS = 8000;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useResumeApi<T = unknown>({
  apiBaseUrl,
  path = DEFAULT_PATH,
  extraParams,
  autoFetch = true,
  maxRetries = DEFAULT_MAX_RETRIES,
  retryDelay = DEFAULT_RETRY_DELAY,
}: UseResumeApiOptions): UseResumeApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ApiStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Serialize extraParams to a stable string so object identity doesn't
  // cause infinite re-renders via useCallback / useEffect dependency chains.
  const extraParamsKey = extraParams
    ? new URLSearchParams(extraParams).toString()
    : '';

  const buildUrl = useCallback(() => {
    const base = `${apiBaseUrl}${path}`;
    if (!extraParamsKey) return base;
    return `${base}?${extraParamsKey}`;
  }, [apiBaseUrl, path, extraParamsKey]);

  const fetchData = useCallback(
    async (attempt = 0) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const timeoutId = setTimeout(
        () => controller.abort('timeout'),
        REQUEST_TIMEOUT_MS
      );

      setStatus('loading');
      setError(null);

      try {
        const res = await fetch(buildUrl(), {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        // Unwrap FastAPI's { data: ..., version: '1.0' } envelope if present
        const unwrapped = (json && typeof json === 'object' && 'data' in json)
          ? (json as { data: T }).data
          : json as T;
        setData(unwrapped);
        setStatus('success');
        setRetryCount(0);
      } catch (err) {
        clearTimeout(timeoutId);

        if ((err as Error).name === 'AbortError' && (err as Error).message !== 'timeout') {
          return;
        }

        const isTimeout = (err as Error).message === 'timeout';
        const isNetworkError =
          isTimeout ||
          (err instanceof TypeError && err.message.includes('fetch'));

        if (isNetworkError && attempt < maxRetries) {
          setRetryCount(attempt + 1);
          retryTimerRef.current = setTimeout(
            () => fetchData(attempt + 1),
            retryDelay * (attempt + 1)
          );
          return;
        }

        const message = isTimeout
          ? 'Request timed out — API may be unavailable'
          : isNetworkError
          ? 'Cannot reach API — check your connection'
          : (err as Error).message || 'An unexpected error occurred';

        setStatus(isNetworkError ? 'unavailable' : 'error');
        setError(message);
        setRetryCount(attempt);
      }
    },
    [buildUrl, maxRetries, retryDelay]
  );

  useEffect(() => {
    setData(null);
    setStatus('idle');
    setError(null);
    setRetryCount(0);

    if (autoFetch) {
      fetchData(0);
    }

    return () => {
      abortRef.current?.abort();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [apiBaseUrl, path, autoFetch, fetchData]);

  const refetch = useCallback(() => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    fetchData(0);
  }, [fetchData]);

  return { data, status, error, refetch, retryCount };
}
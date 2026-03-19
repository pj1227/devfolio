/**
 * useResumeApi
 *
 * Fetches resume data from the currently selected backend.
 * API base URL is driven by the stack selector state, NOT the VITE_API_BASE
 * env var, so the user can switch backends live without a rebuild.
 *
 * Falls back to VITE_API_BASE only if no selector state is available
 * (e.g. during SSR or testing).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'unavailable';

export interface UseResumeApiOptions {
  /** API base URL injected from useStackSelector state */
  apiBaseUrl: string;
  /** Endpoint path, e.g. "/resume" */
  path?: string;
  /** Whether to automatically fetch on mount / when apiBaseUrl changes */
  autoFetch?: boolean;
  /** Max retry attempts on network error (default: 2) */
  maxRetries?: number;
  /** Delay between retries in ms (default: 1200) */
  retryDelay?: number;
}

export interface UseResumeApiReturn<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
  /** Retry / initial fetch */
  refetch: () => void;
  /** How many retries have been attempted */
  retryCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PATH = '/resume';
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1200;
// Timeout before we consider the API unavailable
const REQUEST_TIMEOUT_MS = 8000;

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useResumeApi<T = unknown>({
  apiBaseUrl,
  path = DEFAULT_PATH,
  autoFetch = true,
  maxRetries = DEFAULT_MAX_RETRIES,
  retryDelay = DEFAULT_RETRY_DELAY,
}: UseResumeApiOptions): UseResumeApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ApiStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Track whether a fetch is in-flight so we can abort on unmount / re-trigger
  const abortRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(
    async (attempt = 0) => {
      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Timeout signal
      const timeoutId = setTimeout(
        () => controller.abort('timeout'),
        REQUEST_TIMEOUT_MS
      );

      setStatus('loading');
      setError(null);

      try {
        const url = `${apiBaseUrl}${path}`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json: T = await res.json();
        setData(json);
        setStatus('success');
        setRetryCount(0);
      } catch (err) {
        clearTimeout(timeoutId);

        // Ignore abort errors from our own cleanup
        if ((err as Error).name === 'AbortError' && controller.signal.reason !== 'timeout') {
          return;
        }

        const isTimeout = (err as Error).name === 'AbortError';
        const isNetworkError =
          isTimeout ||
          (err instanceof TypeError && err.message.includes('fetch'));

        if (isNetworkError && attempt < maxRetries) {
          // Retry with backoff
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiBaseUrl, path, maxRetries, retryDelay]
  );

  // Reset + re-fetch whenever the API base URL changes (backend switched)
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

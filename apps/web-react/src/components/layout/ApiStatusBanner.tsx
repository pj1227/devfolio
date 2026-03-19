/**
 * ApiStatusBanner
 *
 * Renders friendly loading skeletons, error states, and unavailable messages.
 * Used by app.tsx to wrap the resume output.
 */

import type { ApiStatus } from '../../hooks/useResumeApi';
import styles from './ApiStatusBanner.module.css';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ApiStatusBannerProps {
  status: ApiStatus;
  error: string | null;
  retryCount: number;
  maxRetries?: number;
  onRetry: () => void;
  /** The backend label, e.g. "FastAPI + Python" */
  backendLabel: string;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className={styles.skeleton} aria-busy="true" aria-label="Loading resume data…">
      <div className={styles.skeletonLine} style={{ width: '40%' }} />
      <div className={styles.skeletonLine} style={{ width: '60%' }} />
      <div className={styles.skeletonLine} style={{ width: '30%' }} />
      <div className={styles.skeletonBlock} />
      <div className={styles.skeletonLine} style={{ width: '55%' }} />
      <div className={styles.skeletonLine} style={{ width: '45%' }} />
    </div>
  );
}

// ─── Retry dots ───────────────────────────────────────────────────────────────

function RetryingSpinner({ retryCount, maxRetries }: { retryCount: number; maxRetries: number }) {
  return (
    <div className={styles.retrying}>
      <span className={styles.spinner} aria-hidden="true" />
      <span>
        Retrying… attempt {retryCount} of {maxRetries}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ApiStatusBanner({
  status,
  error,
  retryCount,
  maxRetries = 2,
  onRetry,
  backendLabel,
}: ApiStatusBannerProps) {
  if (status === 'loading' && retryCount === 0) {
    return <Skeleton />;
  }

  if (status === 'loading' && retryCount > 0) {
    return <RetryingSpinner retryCount={retryCount} maxRetries={maxRetries} />;
  }

  if (status === 'unavailable') {
    return (
      <div className={`${styles.banner} ${styles.bannerUnavailable}`} role="alert">
        <div className={styles.bannerIcon} aria-hidden="true">⚠</div>
        <div className={styles.bannerBody}>
          <strong className={styles.bannerTitle}>
            {backendLabel} is unavailable
          </strong>
          <p className={styles.bannerMessage}>
            {error ?? 'Could not connect to the API. It may be starting up — Railway cold starts can take ~10 s.'}
          </p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`${styles.banner} ${styles.bannerError}`} role="alert">
        <div className={styles.bannerIcon} aria-hidden="true">✕</div>
        <div className={styles.bannerBody}>
          <strong className={styles.bannerTitle}>Something went wrong</strong>
          <p className={styles.bannerMessage}>{error}</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default ApiStatusBanner;

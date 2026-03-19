/**
 * app.tsx — DevFolio main shell
 *
 * Phase 2 / Chunk 2e: Stack Selector UI
 *
 * Wires:
 *   useStackSelector  → manages selection + URL params
 *   useResumeApi      → fetches data from the selected backend
 *   StackSelector     → four-segment UI bar
 *   Header            → shows active frontend + backend
 *   ApiStatusBanner   → loading / error / unavailable states
 */

import { useStackSelector } from '@devfolio/shared-hooks';
import { StackSelector } from '@devfolio/shared-ui';
import { BACKEND_OPTIONS } from '@devfolio/shared-models';
import { useResumeApi } from '../hooks/useResumeApi';
import { Header } from '../components/layout/Header';
import { ApiStatusBanner } from '../components/layout/ApiStatusBanner';
import styles from './app.module.css';

// ─── App ──────────────────────────────────────────────────────────────────────

export function App() {
  const { state, setSegment, segments } = useStackSelector();
  const { selection, apiBaseUrl } = state;

  const { data, status, error, refetch, retryCount } = useResumeApi({
    apiBaseUrl,
    path: '/resume',
    autoFetch: true,
    maxRetries: 2,
    retryDelay: 1200,
  });

  const backendLabel =
    BACKEND_OPTIONS.find((o) => o.key === selection.backend)?.label ??
    selection.backend;

  return (
    <div className={styles.appRoot}>
      {/* ── Header ── */}
      <Header selection={selection} />

      <main className={styles.main}>
        {/* ── Stack selector panel ── */}
        <section className={styles.selectorPanel} aria-label="Stack selector">
          <h2 className={styles.selectorHeading}>
            Choose your stack
          </h2>
          <p className={styles.selectorSubtext}>
            Available options are live. Muted options launch in a future phase.
          </p>
          <StackSelector
            segments={segments}
            selection={selection}
            onSelect={setSegment}
          />
        </section>

        {/* ── Resume output ── */}
        <section className={styles.resumePanel} aria-label="Resume output">
          <>
            <ApiStatusBanner
              status={status}
              error={error}
              retryCount={retryCount}
              maxRetries={2}
              onRetry={refetch}
              backendLabel={backendLabel}
            />
            {status === 'success' && data && (
              <ResumeOutput data={data} />
            )}
          </>
        </section>
      </main>
    </div>
  );
}

// ─── Temporary raw output (replace with proper resume component in next chunk) ─

function ResumeOutput({ data }: { data: unknown }) {
  return (
    <pre
      style={{
        fontSize: '0.7rem',
        overflowX: 'auto',
        padding: '16px',
        borderRadius: '6px',
        background: 'rgba(0,0,0,0.3)',
        color: 'var(--color-text-secondary, #9ca3af)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default App;

/**
 * Header
 *
 * Site header with nav and active stack indicator.
 * Receives the current stack selection as a prop so it stays purely
 * presentational — all state lives in useStackSelector.
 */

import type { StackSelection } from '@devfolio/shared-interfaces';
import { BACKEND_OPTIONS, FRONTEND_OPTIONS } from '@devfolio/shared-models';
import styles from './Header.module.css';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HeaderProps {
  selection: StackSelection;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLabel<K extends string>(
  options: { key: K; label: string; shortLabel?: string }[],
  key: K
): string {
  return options.find((o) => o.key === key)?.label ?? key;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Header({ selection }: HeaderProps) {
  const frontendLabel = getLabel(FRONTEND_OPTIONS, selection.frontend);
  const backendLabel = getLabel(BACKEND_OPTIONS, selection.backend);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <a href="/" className={styles.brand} aria-label="DevFolio home">
          <span className={styles.brandName}>DevFolio</span>
        </a>

        {/* Active stack pill */}
        <div className={styles.stackPill} aria-label="Currently active stack">
          <span className={styles.stackPillSegment}>{frontendLabel}</span>
          <span className={styles.stackPillDivider} aria-hidden="true">+</span>
          <span className={styles.stackPillSegment}>{backendLabel}</span>
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Primary navigation">
          <a
            href="https://github.com/pj1227/devfolio"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            GitHub
          </a>
          <a
            href="https://api.joelcossins.dev/docs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            API Docs
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

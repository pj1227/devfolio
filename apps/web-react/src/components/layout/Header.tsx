/**
 * Header
 *
 * Reuses app.module.css styles to match the existing design language.
 * Purely presentational — all state lives in useStackSelector.
 */

import type { StackSelection } from '@devfolio/shared-interfaces';
import { BACKEND_OPTIONS, FRONTEND_OPTIONS } from '@devfolio/shared-models';
import styles from '../../app/app.module.css';

export interface HeaderProps {
  selection: StackSelection;
}

function getLabel<K extends string>(
  options: { key: K; label: string }[],
  key: K
): string {
  return options.find((o) => o.key === key)?.label ?? key;
}

export function Header({ selection }: HeaderProps) {
  const frontendLabel = getLabel(FRONTEND_OPTIONS, selection.frontend);
  const backendLabel = getLabel(BACKEND_OPTIONS, selection.backend);

  return (
    <header className={styles.header}>
      <div className={styles.logoMark}>
        <span className={styles.logoText}>
          // <span>joel</span>cossins.dev
        </span>
        <span className={styles.logoCursor} aria-hidden="true" />
      </div>

      <div className={styles.stackBadge} aria-label="Currently active stack">
        <span className={styles.stackDot} aria-hidden="true" />
        {frontendLabel} + {backendLabel}
      </div>

      <nav style={{ display: 'flex', gap: '0.5rem' }}>
        <a
          href="https://github.com/pj1227/devfolio"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.heroLink}
        >
          ↗ GitHub
        </a>
        <a
          href="https://api.joelcossins.dev/docs"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.heroLink}
        >
          ↗ API Docs
        </a>
      </nav>
    </header>
  );
}

export default Header;
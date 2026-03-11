import styles from '../../app/app.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoMark}>
        <span className={styles.logoText}>
          _<span>pj</span>
        </span>
        <span className={styles.logoCursor} />
      </div>
      <div className={styles.stackBadge}>
        <span className={styles.stackDot} />
        FastAPI + Python
      </div>
    </header>
  );
}
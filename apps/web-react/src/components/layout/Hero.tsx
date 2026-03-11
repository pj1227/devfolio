import type { Profile } from '@devfolio/shared-interfaces';
import styles from '../../app/app.module.css';

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroLabel}>// joelcossins.dev</div>
        <h1 className={styles.heroName}>{profile.name}</h1>
        <div className={styles.heroTitle}>{'{ '}{profile.title}{' }'}</div>
        {profile.clearance && (
          <div className={styles.clearanceBadge}>
            🔐 {profile.clearance}
          </div>
        )}
        <p className={styles.heroSummary}>{profile.summary}</p>
        <div className={styles.heroLinks}>
          <a href={`mailto:${profile.email}`} className={styles.heroLink}>✉ {profile.email}</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className={styles.heroLink}>⌘ LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noreferrer" className={styles.heroLink}>⌥ GitHub</a>
          <span className={styles.heroLink}>◎ {profile.location}</span>
        </div>
      </div>
    </section>
  );
}
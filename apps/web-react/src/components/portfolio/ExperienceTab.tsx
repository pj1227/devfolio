import type { WorkExperience } from '@devfolio/shared-interfaces';
import type { Resume } from '../../hooks/useResumeApi';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

export function ExperienceTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useResumeApi<WorkExperience[]>('/work-experience', resume);
  if (loading) return <div className={styles.loading}>fetching experience...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  return (
    <div>
      <p className={styles.sectionHeading}>Work Experience</p>
      {data?.map((job, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>{job.company}</div>
              <div className={styles.cardSubtitle}>{job.title}</div>
            </div>
            <div className={styles.cardDate}>
              {job.startDate} → {job.endDate ?? 'present'}
            </div>
          </div>
          {job.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {job.highlights.map((h, j) => <li key={j}>{h}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
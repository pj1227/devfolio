import type { Education } from '@devfolio/shared-interfaces';
import type { Resume } from '../../hooks/useResumeApi';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

export function EducationTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useResumeApi<Education[]>('/education', resume);
  if (loading) return <div className={styles.loading}>fetching education...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  return (
    <div>
      <p className={styles.sectionHeading}>Education</p>
      {data?.map((edu, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>{edu.institution}</div>
              <div className={styles.cardSubtitle}>{edu.degree} in {edu.field}</div>
            </div>
            <div className={styles.cardDate}>
              {edu.startDate} → {edu.endDate ?? 'present'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
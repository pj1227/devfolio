import type { Education } from '@devfolio/shared-interfaces';
import type { Resume } from '../../components/resume/ResumeSelector';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

interface EducationTabProps {
  resume: Resume;
  apiBaseUrl: string;
}

export function EducationTab({ apiBaseUrl }: EducationTabProps) {
  const { data, status, error } = useResumeApi<Education[]>({
    apiBaseUrl,
    path: '/education',
  });

  if (status === 'loading') return <div className={styles.loading}>fetching education...</div>;
  if (status === 'error' || status === 'unavailable') return <div className={styles.error}>Error: {error}</div>;

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
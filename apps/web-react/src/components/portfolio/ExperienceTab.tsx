import type { WorkExperience } from '@devfolio/shared-interfaces';
import type { Resume } from '../../components/resume/ResumeSelector';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

interface ExperienceTabProps {
  resume: Resume;
  apiBaseUrl: string;
}

export function ExperienceTab({ resume, apiBaseUrl }: ExperienceTabProps) {
  const { data, status, error } = useResumeApi<WorkExperience[]>({
    apiBaseUrl,
    path: '/work-experience',
    extraParams: { resume },
  });

  if (status === 'loading') return <div className={styles.loading}>fetching experience...</div>;
  if (status === 'error' || status === 'unavailable') return <div className={styles.error}>Error: {error}</div>;

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
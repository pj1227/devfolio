import type { Project } from '@devfolio/shared-interfaces';
import type { Resume } from '../../components/resume/ResumeSelector';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

interface ProjectsTabProps {
  resume: Resume;
  apiBaseUrl: string;
}

export function ProjectsTab({ apiBaseUrl }: ProjectsTabProps) {
  const { data, status, error } = useResumeApi<Project[]>({
    apiBaseUrl,
    path: '/projects',
  });

  if (status === 'loading') return <div className={styles.loading}>fetching projects...</div>;
  if (status === 'error' || status === 'unavailable') return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <p className={styles.sectionHeading}>Projects</p>
      {data?.map((proj, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{proj.name}</div>
            {proj.githubUrl && (
              <a href={proj.githubUrl} target="_blank" rel="noreferrer" className={styles.heroLink}>
                ↗ repo
              </a>
            )}
          </div>
          <div className={styles.cardBody}>{proj.description}</div>
          {proj.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {proj.highlights.map((h, j) => <li key={j}>{h}</li>)}
            </ul>
          )}
          <div className={styles.projectTags}>
            {proj.technologies?.map((t, j) => <span key={j} className={styles.tag}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
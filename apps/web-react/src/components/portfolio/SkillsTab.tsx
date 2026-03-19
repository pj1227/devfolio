import type { SkillCategory } from '@devfolio/shared-interfaces';
import type { Resume } from '../../components/resume/ResumeSelector';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

interface SkillsTabProps {
  resume: Resume;
  apiBaseUrl: string;
}

export function SkillsTab({ apiBaseUrl }: SkillsTabProps) {
  const { data, status, error } = useResumeApi<SkillCategory[]>({
    apiBaseUrl,
    path: '/skills',
  });

  if (status === 'loading') return <div className={styles.loading}>fetching skills...</div>;
  if (status === 'error' || status === 'unavailable') return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <p className={styles.sectionHeading}>Skills</p>
      <div className={styles.skillsGrid}>
        {data?.map((cat, i) => (
          <div key={i} className={styles.skillCategory}>
            <div className={styles.skillCategoryName}>{cat.category}</div>
            <div className={styles.skillList}>
              {cat.skills.map((skill, j) => (
                <div key={j} className={styles.skillItem}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <span className={`${styles.skillBadge} ${styles[skill.proficiency]}`}>
                    {skill.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
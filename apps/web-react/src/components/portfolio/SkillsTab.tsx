import type { SkillCategory } from '@devfolio/shared-interfaces';
import type { Resume } from '../../hooks/useResumeApi';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

export function SkillsTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useResumeApi<SkillCategory[]>('/skills', resume);
  if (loading) return <div className={styles.loading}>fetching skills...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
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
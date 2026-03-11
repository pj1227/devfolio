import type { Resume } from '../../hooks/useResumeApi';
import styles from '../../app/app.module.css';

const RESUME_VARIANTS: { id: Resume; label: string }[] = [
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'dotnet',   label: '.NET' },
];

interface ResumeSelectorProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

export function ResumeSelector({ resume, onChange }: ResumeSelectorProps) {
  return (
    <div className={styles.resumeSelector}>
      <span className={styles.resumeSelectorLabel}>// resume</span>
      <div className={styles.resumeSegment}>
        {RESUME_VARIANTS.map((v) => (
          <button
            key={v.id}
            className={`${styles.resumeSegmentBtn} ${resume === v.id ? styles.resumeSegmentActive : ''}`}
            onClick={() => onChange(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
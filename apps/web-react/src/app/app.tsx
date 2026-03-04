import { useState, useEffect } from 'react';
import styles from './app.module.css';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

type Tab = 'experience' | 'education' | 'skills' | 'projects' | 'tech-stack';
type Resume = 'fullstack' | 'dotnet';

const TABS: { id: Tab; label: string }[] = [
  { id: 'experience', label: '01_experience' },
  { id: 'education', label: '02_education' },
  { id: 'skills', label: '03_skills' },
  { id: 'projects', label: '04_projects' },
  { id: 'tech-stack', label: '05_tech_stack' },
];

const RESUME_VARIANTS: { id: Resume; label: string }[] = [
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'dotnet',   label: '.NET' },
];

function useFetch<T>(endpoint: string, resume: Resume) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = endpoint === '/tech-stack'
      ? `${API_BASE}${endpoint}`
      : `${API_BASE}${endpoint}?resume=${resume}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setData(json.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [endpoint, resume]);

  return { data, loading, error };
}

/* ── Profile (always loaded) ── */
interface Profile {
  name: string; title: string; clearance: string | null;
  email: string; phone: string; location: string;
  linkedin: string; github: string; summary: string;
}

/* ── Work Experience ── */
interface WorkExperience {
  company: string; title: string;
  startDate: string; endDate: string | null;
  location: string; highlights: string[];
}

function ExperienceTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useFetch<WorkExperience[]>('/work-experience', resume);
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

/* ── Education ── */
interface Education {
  institution: string; degree: string;
  field: string; startDate: string; endDate: string | null;
}

function EducationTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useFetch<Education[]>('/education', resume);
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

/* ── Skills ── */
interface Skill { name: string; proficiency: string; }
interface SkillCategory { category: string; skills: Skill[]; }

function SkillsTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useFetch<SkillCategory[]>('/skills', resume);
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

/* ── Projects ── */
interface Project {
  name: string; description: string;
  techStack: string[]; url: string | null; highlights: string[];
}

function ProjectsTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useFetch<Project[]>('/projects', resume);
  if (loading) return <div className={styles.loading}>fetching projects...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  return (
    <div>
      <p className={styles.sectionHeading}>Projects</p>
      {data?.map((proj, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{proj.name}</div>
            {proj.url && (
              <a href={proj.url} target="_blank" rel="noreferrer" className={styles.heroLink}>
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
            {proj.techStack?.map((t, j) => <span key={j} className={styles.tag}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Tech Stack ── */
interface TechStackInfo {
  generatedAt: string;
  runtime: { name: string; version: string; implementation: string };
  framework: { name: string; version: string; extra: Record<string, string> };
  database: { name: string; version: string; dialect: string; connected: boolean };
  os: { platform: string; release: string; architecture: string };
  packages: { name: string; version: string; category: string }[];
}

function TechStackTab({ resume }: { resume: Resume }) {
  const { data, loading, error } = useFetch<TechStackInfo>('/tech-stack', resume);
  if (loading) return <div className={styles.loading}>fetching live runtime data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!data) return null;
  return (
    <div>
      <p className={styles.sectionHeading}>Live Runtime Environment</p>
      <div className={styles.techGrid}>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.runtime.name}</div>
          <div className={styles.techCardCategory}>runtime</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>version</span>
              <span className={styles.techMetaValue}>{data.runtime.version}</span>
            </div>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>impl</span>
              <span className={styles.techMetaValue}>{data.runtime.implementation}</span>
            </div>
          </div>
        </div>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.framework.name}</div>
          <div className={styles.techCardCategory}>framework</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>version</span>
              <span className={styles.techMetaValue}>{data.framework.version}</span>
            </div>
            {Object.entries(data.framework.extra ?? {}).map(([k, v]) => (
              <div key={k} className={styles.techMetaRow}>
                <span className={styles.techMetaKey}>{k}</span>
                <span className={styles.techMetaValue}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.database.name}</div>
          <div className={styles.techCardCategory}>database</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>dialect</span>
              <span className={styles.techMetaValue}>{data.database.dialect}</span>
            </div>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>connected</span>
              <span className={styles.techMetaValue}>
                {data.database.connected ? '✓ yes' : '✗ seed mode'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.os.platform}</div>
          <div className={styles.techCardCategory}>os</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>release</span>
              <span className={styles.techMetaValue}>{data.os.release}</span>
            </div>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>arch</span>
              <span className={styles.techMetaValue}>{data.os.architecture}</span>
            </div>
          </div>
        </div>
        {data.packages.map((pkg, i) => (
          <div key={i} className={styles.techCard}>
            <div className={styles.techCardName}>{pkg.name}</div>
            <div className={styles.techCardCategory}>{pkg.category}</div>
            <div className={styles.techMeta}>
              <div className={styles.techMetaRow}>
                <span className={styles.techMetaKey}>version</span>
                <span className={styles.techMetaValue}>{pkg.version}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── App Shell ── */
export function App() {
  const [activeTab, setActiveTab]   = useState<Tab>('experience');
  const [resume, setResume]         = useState<Resume>('fullstack');
  const { data: profile }           = useFetch<Profile>('/profile', resume);

  const renderTab = () => {
    switch (activeTab) {
      case 'experience':  return <ExperienceTab resume={resume} />;
      case 'education':   return <EducationTab  resume={resume} />;
      case 'skills':      return <SkillsTab     resume={resume} />;
      case 'projects':    return <ProjectsTab   resume={resume} />;
      case 'tech-stack':  return <TechStackTab  resume={resume} />;
    }
  };

  return (
    <div className={styles.app}>
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

      {profile && (
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroLabel}>// portfolio.dev</div>
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
      )}

      {/* ── Resume Selector ── */}
      <div className={styles.resumeSelector}>
        <span className={styles.resumeSelectorLabel}>// resume</span>
        <div className={styles.resumeSegment}>
          {RESUME_VARIANTS.map((v) => (
            <button
              key={v.id}
              className={`${styles.resumeSegmentBtn} ${resume === v.id ? styles.resumeSegmentActive : ''}`}
              onClick={() => setResume(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <nav className={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        {renderTab()}
      </main>
    </div>
  );
}

export default App;
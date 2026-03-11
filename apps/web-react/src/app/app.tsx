import { useState } from 'react';
import type { Profile } from '@devfolio/shared-interfaces';
import { useResumeApi, type Resume } from '../hooks/useResumeApi';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/layout/Hero';
import { ResumeSelector } from '../components/resume/ResumeSelector';
import { ExperienceTab } from '../components/portfolio/ExperienceTab';
import { EducationTab } from '../components/portfolio/EducationTab';
import { SkillsTab } from '../components/portfolio/SkillsTab';
import { ProjectsTab } from '../components/portfolio/ProjectsTab';
import { TechStackTab } from './stack/TechStackTab';
import styles from './app.module.css';

type Tab = 'experience' | 'education' | 'skills' | 'projects' | 'tech-stack';

const TABS: { id: Tab; label: string }[] = [
  { id: 'experience', label: '01_experience' },
  { id: 'education',  label: '02_education' },
  { id: 'skills',     label: '03_skills' },
  { id: 'projects',   label: '04_projects' },
  { id: 'tech-stack', label: '05_tech_stack' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('experience');
  const [resume, setResume]       = useState<Resume>('fullstack');
  const { data: profile }         = useResumeApi<Profile>('/profile', resume);

  const renderTab = () => {
    switch (activeTab) {
      case 'experience': return <ExperienceTab resume={resume} />;
      case 'education':  return <EducationTab  resume={resume} />;
      case 'skills':     return <SkillsTab     resume={resume} />;
      case 'projects':   return <ProjectsTab   resume={resume} />;
      case 'tech-stack': return <TechStackTab />;
    }
  };

  return (
    <div className={styles.app}>
      <Header />
      {profile && <Hero profile={profile} />}
      <ResumeSelector resume={resume} onChange={setResume} />
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
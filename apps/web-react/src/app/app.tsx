import { useState } from 'react';
import type { Profile } from '@devfolio/shared-interfaces';
import { useStackSelector } from '@devfolio/shared-hooks';
import { StackSelector } from '@devfolio/shared-ui';
import { BACKEND_OPTIONS } from '@devfolio/shared-models';
import { useResumeApi } from '../hooks/useResumeApi';
import type { Resume } from '../components/resume/ResumeSelector';
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

  const { state, setSegment, segments } = useStackSelector();
  const { selection, apiBaseUrl } = state;

  const { data: profile } = useResumeApi<Profile>({
    apiBaseUrl,
    path: '/profile',
    extraParams: { resume },
  });

  const renderTab = () => {
    switch (activeTab) {
      case 'experience': return <ExperienceTab resume={resume} apiBaseUrl={apiBaseUrl} />;
      case 'education':  return <EducationTab  resume={resume} apiBaseUrl={apiBaseUrl} />;
      case 'skills':     return <SkillsTab     resume={resume} apiBaseUrl={apiBaseUrl} />;
      case 'projects':   return <ProjectsTab   resume={resume} apiBaseUrl={apiBaseUrl} />;
      case 'tech-stack': return <TechStackTab  apiBaseUrl={apiBaseUrl} />;
    }
  };

  return (
    <div className={styles.app}>
      <Header selection={selection} />
      {profile && <Hero profile={profile} />}

      <div className={styles.stackSelectorWrap}>
        <StackSelector
          segments={segments}
          selection={selection}
          onSelect={setSegment}
        />
      </div>

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
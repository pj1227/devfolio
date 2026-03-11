/**
 * @file domain.ts
 * @description Core resume domain types.
 * These are the data shapes that represent Joel's actual resume content.
 * Every frontend renders these. Every backend returns these.
 */

// ── Proficiency ───────────────────────────────────────────────────────────────

export type ProficiencyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

// ── Profile ───────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  title: string;
  clearance?: string;
  summary: string;
  email: string;       // server-side only — never returned by the API
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatarUrl?: string;
}

// ── Work Experience ───────────────────────────────────────────────────────────

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;   // "YYYY-MM"
  endDate?: string;    // omitted when current === true
  current: boolean;
  summary: string;
  highlights: string[];
  technologies: string[];
  companyUrl?: string;
}

// ── Education ─────────────────────────────────────────────────────────────────

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  highlights?: string[];
}

// ── Skills ────────────────────────────────────────────────────────────────────

export interface Skill {
  name: string;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number;
  highlighted?: boolean;  // true = shown on Dashboard hero
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

// ── Projects ──────────────────────────────────────────────────────────────────

export type ProjectCategory =
  | 'web'
  | 'api'
  | 'cli'
  | 'library'
  | 'mobile'
  | 'devops'
  | 'data'
  | 'other';

export interface Project {
  id: string;
  name: string;
  description: string;
  summary: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  startDate: string;
  current: boolean;
  highlights: string[];
  category: ProjectCategory;
}

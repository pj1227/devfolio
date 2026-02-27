/**
 * @file services.ts
 * @description Service and repository interfaces.
 *
 * IResumeService    — implemented by every backend (FastAPI, Laravel, Rails, ASP.NET)
 * IResumeRepository — implemented by every data layer (Postgres, MySQL, MongoDB)
 * IFrontendResumeService — implemented by every frontend HTTP client
 *
 * If a backend doesn't implement all methods here, TypeScript refuses to compile.
 * That's the contract enforcement mechanism.
 */

import type {
  Profile,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
} from './domain';

import type { TechStackInfo } from './tech-stack';

// ── Backend service layer ─────────────────────────────────────────────────────

export interface IResumeService {
  getProfile(): Promise<Profile>;
  getWorkExperience(): Promise<WorkExperience[]>;
  getEducation(): Promise<Education[]>;
  getSkills(): Promise<SkillCategory[]>;
  getProjects(): Promise<Project[]>;
  getTechStack(): Promise<TechStackInfo>;  // the "phpinfo()" method
}

// ── Backend data access layer ─────────────────────────────────────────────────

export interface IResumeRepository {
  findProfile(): Promise<Profile>;
  findWorkExperience(): Promise<WorkExperience[]>;
  findEducation(): Promise<Education[]>;
  findSkills(): Promise<SkillCategory[]>;
  findProjects(): Promise<Project[]>;
  getDatabaseVersion(): Promise<string>;  // live from SELECT version()
  getDatabaseName(): Promise<string>;
}

// ── Frontend HTTP client ──────────────────────────────────────────────────────

export interface IFrontendResumeService {
  getProfile(): Promise<Profile>;
  getWorkExperience(): Promise<WorkExperience[]>;
  getEducation(): Promise<Education[]>;
  getSkills(): Promise<SkillCategory[]>;
  getProjects(): Promise<Project[]>;
  getTechStack(): Promise<TechStackInfo>;
}

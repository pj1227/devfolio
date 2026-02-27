/**
 * TDD — RED PHASE
 * Verifies Joel's resume data satisfies the shared interfaces.
 * Will pass once validators.ts exists (Phase 1a).
 */
import { describe, it, expect } from 'vitest';
import {
  PROFILE_SEED,
  WORK_EXPERIENCE_SEED,
  EDUCATION_SEED,
  SKILLS_SEED,
  PROJECTS_SEED,
  FRONTEND_STACK_OPTIONS,
  BACKEND_STACK_OPTIONS,
  DATABASE_STACK_OPTIONS,
} from '../index';
import { isProfile, isWorkExperience } from '@devfolio/shared-interfaces';

describe('PROFILE_SEED', () => {
  it('satisfies the Profile interface', () => {
    expect(isProfile(PROFILE_SEED)).toBe(true);
  });
  it('contains the correct name', () => {
    expect(PROFILE_SEED.name).toBe('Joel M. Cossins');
  });
  it('does not expose a phone number', () => {
    expect(PROFILE_SEED).not.toHaveProperty('phone');
  });
  it('links to the correct GitHub profile', () => {
    expect(PROFILE_SEED.github).toBe('https://github.com/pj1227');
  });
  it('shows Remote location', () => {
    expect(PROFILE_SEED.location).toMatch(/Remote/i);
  });
});

describe('WORK_EXPERIENCE_SEED', () => {
  it('contains at least 3 entries', () => {
    expect(WORK_EXPERIENCE_SEED.length).toBeGreaterThanOrEqual(3);
  });
  it('every entry satisfies the WorkExperience interface', () => {
    WORK_EXPERIENCE_SEED.forEach(exp => expect(isWorkExperience(exp)).toBe(true));
  });
  it('first entry is current', () => {
    expect(WORK_EXPERIENCE_SEED[0].current).toBe(true);
  });
  it('BigBear.ai entry includes the re-architecture narrative', () => {
    const bigbear = WORK_EXPERIENCE_SEED.find(e => e.company === 'BigBear.ai');
    const hasStory = bigbear?.highlights.some(h =>
      h.toLowerCase().includes('re-architect')
    );
    expect(hasStory).toBe(true);
  });
  it('BigBear.ai entry includes Silverlight, Angular, and XAML in technologies', () => {
    const bigbear = WORK_EXPERIENCE_SEED.find(e => e.company === 'BigBear.ai');
    expect(bigbear?.technologies).toContain('Silverlight');
    expect(bigbear?.technologies).toContain('Angular');
    expect(bigbear?.technologies).toContain('XAML');
  });
  it('each entry has at least one highlight', () => {
    WORK_EXPERIENCE_SEED.forEach(exp => expect(exp.highlights.length).toBeGreaterThan(0));
  });
  it('no current entry has an endDate', () => {
    WORK_EXPERIENCE_SEED.filter(e => e.current).forEach(exp =>
      expect(exp.endDate).toBeUndefined()
    );
  });
});

describe('EDUCATION_SEED', () => {
  it('contains exactly 2 entries', () => {
    expect(EDUCATION_SEED.length).toBe(2);
  });
  it('includes a BS in Information Technology', () => {
    const bs = EDUCATION_SEED.find(e => e.degree === 'Bachelor of Science');
    expect(bs?.field).toBe('Information Technology');
  });
  it('includes an AAS from the Air Force', () => {
    const aas = EDUCATION_SEED.find(e => e.institution === 'College of the Air Force');
    expect(aas?.degree).toBe('Associate of Applied Science');
  });
});

describe('SKILLS_SEED', () => {
  it('contains a Frontend category', () => {
    expect(SKILLS_SEED.find(c => c.category === 'Frontend')).toBeDefined();
  });
  it('lists Angular as expert', () => {
    const angular = SKILLS_SEED
      .find(c => c.category === 'Frontend')?.skills
      .find(s => s.name === 'Angular');
    expect(angular?.proficiency).toBe('expert');
  });
  it('lists WCF explicitly in Backend', () => {
    const wcf = SKILLS_SEED
      .find(c => c.category === 'Backend')?.skills
      .find(s => s.name.includes('WCF'));
    expect(wcf).toBeDefined();
  });
  it('lists WPF/XAML in Backend', () => {
    const wpf = SKILLS_SEED
      .find(c => c.category === 'Backend')?.skills
      .find(s => s.name.includes('WPF'));
    expect(wpf).toBeDefined();
  });
  it('has at least one highlighted skill', () => {
    const highlighted = SKILLS_SEED.flatMap(c => c.skills).filter(s => s.highlighted);
    expect(highlighted.length).toBeGreaterThan(0);
  });
});

describe('PROJECTS_SEED', () => {
  it('DevFolio is featured', () => {
    const devfolio = PROJECTS_SEED.find(p => p.id === 'proj-001');
    expect(devfolio?.featured).toBe(true);
  });
  it('WPF Weather has a GitHub link', () => {
    const wpf = PROJECTS_SEED.find(p => p.id === 'proj-002');
    expect(wpf?.githubUrl).toBe('https://github.com/pj1227/WPF-Weather-or-Not');
  });
});

describe('Stack selector options', () => {
  it('Next.js Phase 1 is available', () => {
    const next = FRONTEND_STACK_OPTIONS.find(o => o.value === 'next');
    expect(next?.available).toBe(true);
    expect(next?.phase).toBe(1);
  });
  it('Phase 2+ frontends are not available', () => {
    FRONTEND_STACK_OPTIONS.filter(o => o.phase > 1).forEach(o =>
      expect(o.available).toBe(false)
    );
  });
  it('FastAPI Phase 1 is available', () => {
    expect(BACKEND_STACK_OPTIONS.find(o => o.value === 'fastapi')?.available).toBe(true);
  });
  it('PostgreSQL Phase 1 is available', () => {
    expect(DATABASE_STACK_OPTIONS.find(o => o.value === 'postgres')?.available).toBe(true);
  });
  it('all four backends are defined', () => {
    const values = BACKEND_STACK_OPTIONS.map(o => o.value);
    expect(values).toContain('fastapi');
    expect(values).toContain('laravel');
    expect(values).toContain('rails');
    expect(values).toContain('aspnet');
  });
});

/**
 * TDD — RED PHASE
 * These tests import from validators.ts which doesn't exist yet.
 * They will fail until Phase 1a when we create that file.
 */
import { describe, it, expect } from 'vitest';
import {
  isProfile,
  isWorkExperience,
  isTechStackInfo,
  isValidProficiencyLevel,
  isValidProjectCategory,
  isValidDatabaseDialect,
} from '../validators';

describe('isProfile()', () => {
  it('returns true for a valid Profile object', () => {
    expect(isProfile({
      name: 'Joel M. Cossins',
      title: 'Senior Full Stack Software Developer',
      summary: 'A summary.',
      email: 'joel@example.com',
      location: 'Remote — US',
    })).toBe(true);
  });

  it('returns false when name is missing', () => {
    expect(isProfile({
      title: 'Developer', summary: 'Summary',
      email: 'x@x.com', location: 'US',
    })).toBe(false);
  });

  it('returns false when email is missing', () => {
    expect(isProfile({
      name: 'Joel', title: 'Developer',
      summary: 'Summary', location: 'US',
    })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isProfile(null)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isProfile('Joel M. Cossins')).toBe(false);
  });

  it('allows optional fields to be undefined', () => {
    expect(isProfile({
      name: 'Joel', title: 'Dev',
      summary: 'Summary', email: 'j@j.com', location: 'US',
    })).toBe(true);
  });
});

describe('isWorkExperience()', () => {
  const valid = {
    id: 'we-001', company: 'BigBear.ai', title: 'Software Developer',
    location: 'Ann Arbor, MI', startDate: '2015-06', current: false,
    endDate: '2025-08', summary: 'Led development.',
    highlights: ['Did a thing'], technologies: ['Angular', 'C#'],
  };

  it('returns true for a valid WorkExperience object', () => {
    expect(isWorkExperience(valid)).toBe(true);
  });

  it('returns true when current is true and endDate is absent', () => {
    expect(isWorkExperience({ ...valid, current: true, endDate: undefined })).toBe(true);
  });

  it('returns false when highlights is not an array', () => {
    expect(isWorkExperience({ ...valid, highlights: 'Not an array' })).toBe(false);
  });

  it('returns false when technologies is not an array', () => {
    expect(isWorkExperience({ ...valid, technologies: null })).toBe(false);
  });

  it('returns false when id is missing', () => {
    const { id: _omit, ...noId } = valid;
    expect(isWorkExperience(noId)).toBe(false);
  });
});

describe('isTechStackInfo()', () => {
  const valid = {
    generatedAt: '2025-08-01T12:00:00Z',
    runtime: { name: 'Python', version: '3.12.3' },
    framework: { name: 'FastAPI', version: '0.115.4' },
    database: { name: 'PostgreSQL', version: '17.2', dialect: 'postgres', connected: true },
    os: { platform: 'Linux', release: '6.8.0', architecture: 'x86_64' },
    environment: { name: 'development', timezone: 'UTC' },
    packages: [{ name: 'fastapi', version: '0.115.4' }],
  };

  it('returns true for a valid TechStackInfo object', () => {
    expect(isTechStackInfo(valid)).toBe(true);
  });

  it('returns false when generatedAt is missing', () => {
    const { generatedAt: _omit, ...noDate } = valid;
    expect(isTechStackInfo(noDate)).toBe(false);
  });

  it('returns false when database.connected is missing', () => {
    expect(isTechStackInfo({
      ...valid,
      database: { name: 'PostgreSQL', version: '17.2', dialect: 'postgres' },
    })).toBe(false);
  });

  it('returns false when runtime is missing', () => {
    const { runtime: _omit, ...noRuntime } = valid;
    expect(isTechStackInfo(noRuntime)).toBe(false);
  });
});

describe('isValidProficiencyLevel()', () => {
  it('accepts all valid levels', () => {
    ['beginner', 'intermediate', 'advanced', 'expert'].forEach(v =>
      expect(isValidProficiencyLevel(v)).toBe(true)
    );
  });

  it('rejects invalid values', () => {
    expect(isValidProficiencyLevel('guru')).toBe(false);
    expect(isValidProficiencyLevel('')).toBe(false);
    expect(isValidProficiencyLevel(null)).toBe(false);
  });
});

describe('isValidProjectCategory()', () => {
  it('accepts all valid categories', () => {
    ['web', 'api', 'cli', 'library', 'mobile', 'devops', 'data', 'other'].forEach(v =>
      expect(isValidProjectCategory(v)).toBe(true)
    );
  });

  it('rejects invalid values', () => {
    expect(isValidProjectCategory('desktop')).toBe(false);
  });
});

describe('isValidDatabaseDialect()', () => {
  it('accepts all valid dialects', () => {
    ['postgres', 'mysql', 'mssql', 'sqlite', 'mongodb'].forEach(v =>
      expect(isValidDatabaseDialect(v)).toBe(true)
    );
  });

  it('rejects invalid values', () => {
    expect(isValidDatabaseDialect('oracle')).toBe(false);
  });
});

/**
 * @file index.ts
 * @description Barrel file — re-exports everything from focused modules.
 *
 * Consumers import from the package root as normal:
 *   import type { Profile, TechStackInfo } from '@devfolio/shared-interfaces';
 *
 * This file just maps those imports to the right source file.
 * Nothing is defined here — only re-exported.
 */

export * from './domain';
export * from './tech-stack';
export * from './services';
export * from './api';
export * from './stack-selector';
export * from './validators';  // will exist after Phase 1a

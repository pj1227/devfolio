import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@devfolio/shared-interfaces',
        replacement: resolve(__dirname, 'libs/shared/interfaces/src/index.ts'),
      },
      {
        find: '@devfolio/shared-models',
        replacement: resolve(__dirname, 'libs/shared/models/src/index.ts'),
      },
    ],
  },
  test: {
    include: [
      'libs/**/src/__tests__/**/*.test.ts',
      'apps/**/src/__tests__/**/*.test.ts',
    ],
  },
});

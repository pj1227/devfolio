import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@devfolio/shared-interfaces',
        replacement: resolve(__dirname, '../interfaces/src/index.ts'),
      },
    ],
  },
  test: {
    name: 'shared-models',
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
  },
});

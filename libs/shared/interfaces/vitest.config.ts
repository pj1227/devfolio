import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: '../../',
    }),
  ],
  test: {
    name: 'shared-interfaces',
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
  },
});

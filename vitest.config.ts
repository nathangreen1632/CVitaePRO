import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['client/src/**/*.test.{ts,tsx}'], // Only run tests in this pattern
    exclude: ['**/node_modules/**', '**/dist/**', 'client/src/hooks/useActivityDetector.test.ts'],
    setupFiles: 'client/jest.setup.ts', // optional for shared setup
  },
});

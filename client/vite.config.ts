import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [
    react({
      jsxImportSource: 'react',
    }),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 6000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@splinetool/react-spline')) {
              return 'spline';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    include: ['src/**/*.vitest.ts', 'src/**/*.vitest.tsx'],
    exclude: ['**/*.test.ts', 'node_modules', 'dist'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/test/setup.ts',
  },
});

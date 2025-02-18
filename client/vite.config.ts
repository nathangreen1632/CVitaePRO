import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
        secure: false
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 5500, // ✅ Increased limit to prevent warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@splinetool/react-spline")) {
              return "spline"; // ✅ Moves Spline into its own chunk
            }
            return "vendor"; // ✅ Moves all other dependencies into a "vendor" chunk
          }
        },
      },
    },
  },
});

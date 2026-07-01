import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config: standard React setup + Vitest using jsdom for component tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});

import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { siteIndexFiles } from './vite-plugins/site-index-files.plugin.ts';

export default defineConfig({
  // GitHub Pages serves a project site under /<repository>/; the deploy workflow passes that path here.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), siteIndexFiles()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // The 3D scene (three + drei + postprocessing) is a lazy chunk of ~1.1 MB loaded after first paint.
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

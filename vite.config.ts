import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { siteIndexFiles } from './vite-plugins/site-index-files.plugin.ts';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), siteIndexFiles()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

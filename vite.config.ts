/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildVersion = new Date().toISOString();

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(buildVersion) },
  plugins: [react(), {
    name: 'app-version',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: buildVersion }) });
    },
  }],
  // Относительный base — чтобы собранный сайт одинаково работал что на
  // GitHub Pages (адрес вида username.github.io/AlexViet/), что на любом
  // другом хостинге в подпапке или в корне. В сайте нет client-side
  // роутинга по URL (вся навигация — состояние React), поэтому
  // относительные пути ничего не ломают.
  base: '/AlexViet/',
  build: { rollupOptions: { input: { main: 'index.html', test: 'test/index.html' } } },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});

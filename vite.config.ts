/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Относительный base — чтобы собранный сайт одинаково работал что на
  // GitHub Pages (адрес вида username.github.io/AlexViet/), что на любом
  // другом хостинге в подпапке или в корне. В сайте нет client-side
  // роутинга по URL (вся навигация — состояние React), поэтому
  // относительные пути ничего не ломают.
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
  },
});

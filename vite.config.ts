import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/functions': {
        target: '/',
        rewrite: (path) => path.replace(/^\/functions/, '')
      }
    }
  }
});
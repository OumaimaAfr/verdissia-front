
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/verdisia': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
});

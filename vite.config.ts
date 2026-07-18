import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/leaderboard': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true
      },
      '/api/gallery': {
        target: 'https://r2-jk.makuraly.xyz',
        changeOrigin: true,
        rewrite: () => '/denia/images.json'
      }
    }
  }
});

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: { port: 8080 },
  alias: { '@': '/src' },
  build: { sourcemap: false },
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@import "@/assets/style/color.scss";' },
    },
  },
});

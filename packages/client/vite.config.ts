import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { getThemeVariables } from 'ant-design-vue/dist/theme';

export default defineConfig({
  plugins: [vue()],
  server: { port: 8080 },
  resolve: { alias: { '@': '/src' } },
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        render: resolve(__dirname, 'share.html'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: getThemeVariables(),
      },
    },
  },
});

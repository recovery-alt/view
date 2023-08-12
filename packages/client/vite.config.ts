import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import jsx from '@vitejs/plugin-vue-jsx';
import windiCSS from 'vite-plugin-windicss';

const plugins = [vue(), jsx(), windiCSS()];

export default defineConfig({
  plugins,
  server: { port: 8080 },
  resolve: { alias: { '@': '/src' } },
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        render: resolve(__dirname, 'share.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('@codemirror')) {
            return 'codemirror';
          } else if (id.includes('node-forge')) {
            return 'node-forge';
          } else if (id.includes('prettier')) {
            return 'prettier';
          } else if (id.includes('ant-design-vue')) {
            return 'ant-design-vue';
          } else if (id.includes('lodash')) {
            return 'lodash';
          } else if (id.includes('echarts')) {
            return 'echarts';
          } else if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});

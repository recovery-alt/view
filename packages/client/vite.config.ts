import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import jsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import windiCSS from 'vite-plugin-windicss';
// import { theme } from 'ant-design-vue/lib';
// import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken';

// const { defaultAlgorithm, defaultSeed, darkAlgorithm } = theme;

// const mapToken = defaultAlgorithm(defaultSeed);
// const mapTokenDark = darkAlgorithm(defaultSeed);
// const v3Token = convertLegacyToken(mapToken);
// const v3TokenDark = convertLegacyToken(mapTokenDark);

const plugins = [vue(), jsx(), eslintPlugin(), windiCSS()];

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
        // modifyVars: v3Token,
        javascriptEnabled: true,
      },
    },
  },
});

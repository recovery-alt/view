import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import jsx from '@vitejs/plugin-vue-jsx';
import viteEslint from '@ehutch79/vite-eslint';
import usePluginImport from 'vite-plugin-importer';

export default defineConfig({
  plugins: [
    vue(),
    jsx(),
    viteEslint(),
    usePluginImport({
      libraryName: 'ant-design-vue',
      libraryDirectory: 'es',
      style: 'css',
    }),
  ],
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
      },
    },
  },
});

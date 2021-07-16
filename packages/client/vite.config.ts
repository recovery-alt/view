import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import jsx from '@vitejs/plugin-vue-jsx';
import viteEslint from '@ehutch79/vite-eslint';
import styleImport from 'vite-plugin-style-import';

export default defineConfig({
  plugins: [
    vue(),
    jsx(),
    viteEslint(),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: name => {
            const exclude = [
              'select-option',
              'form-item',
              'collapse-panel',
              'tab-pane',
              'timeline-item',
              'menu-item',
              'input-search',
              'layout-sider',
              'layout-header',
              'layout-content',
              'textarea',
            ];
            if (!exclude.includes(name)) return `ant-design-vue/es/${name}/style/index`;
          },
        },
      ],
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

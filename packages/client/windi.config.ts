import { defineConfig } from 'windicss/helpers';
import typography from 'windicss/plugin/typography';

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,tsx}', 'index.html'],
    exclude: ['src/share'],
  },
  plugins: [typography()],
});

import { defineStore } from 'pinia';
import { LocalKeys } from '@/enum';
import { local } from '@/utils';
import { darkCssIsReady, loadDarkThemeCss } from 'vite-plugin-theme/es/client';

export const useThemeStore = defineStore('theme', {
  state() {
    const value = 'light' as 'dark' | 'light';
    return { value };
  },
  actions: {
    async changeTheme(theme: 'light' | 'dark') {
      this.value = theme;
      if (theme === 'dark') {
        if (import.meta.env.PROD && !darkCssIsReady) await loadDarkThemeCss();
        local.set(LocalKeys.IS_DARK, 1);
      } else {
        local.remove(LocalKeys.IS_DARK);
      }

      document.documentElement.setAttribute('data-theme', this.value);
    },
    async switchTheme() {
      const isDark = local.get(LocalKeys.IS_DARK);
      this.changeTheme(isDark ? 'light' : 'dark');
    },
  },
});

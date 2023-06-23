import { defineStore } from 'pinia';
import { LocalKeys } from '@/enum';
import { local } from '@/utils';
import { theme } from 'ant-design-vue';

export const useThemeStore = defineStore('theme', {
  state() {
    const value = 'light' as 'dark' | 'light';
    return { value };
  },
  getters: {
    algorithm: state => (state.value === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm),
  },
  actions: {
    async changeTheme(theme: 'light' | 'dark') {
      this.value = theme;
      if (theme === 'dark') {
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

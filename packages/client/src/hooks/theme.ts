import { ref } from 'vue';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import { darkCssIsReady, loadDarkThemeCss } from 'vite-plugin-theme/es/client';

export const theme = ref<'light' | 'dark'>('light');

export const changeTheme = async () => {
  const isDark = local.get(LocalKeys.IS_DARK);
  if (isDark) {
    theme.value = 'light';
    local.remove(LocalKeys.IS_DARK);
  } else {
    // 第一次渲染暗黑主题
    if (import.meta.env.PROD && !darkCssIsReady) await loadDarkThemeCss();
    theme.value = 'dark';
    local.set(LocalKeys.IS_DARK, 1);
  }
  document.documentElement.setAttribute('data-theme', theme.value);
};

<template>
  <ConfigProvider :locale="locale">
    <RouterView />
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import locale from 'ant-design-vue/es/locale/zh_CN';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import { theme } from '@/hooks';
import { ConfigProvider } from 'ant-design-vue';
import { darkCssIsReady, loadDarkThemeCss } from 'vite-plugin-theme/es/client';

onMounted(async () => {
  const isDark = local.get(LocalKeys.IS_DARK);
  // 如果默认为暗黑主题，直接加载暗黑主题资源
  if (isDark && import.meta.env.PROD && !darkCssIsReady) await loadDarkThemeCss();
  theme.value = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme.value);
});
</script>

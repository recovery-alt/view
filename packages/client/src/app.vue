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
import { ConfigProvider } from 'ant-design-vue';
import { useThemeStore } from '@/store';

onMounted(async () => {
  const isDark = local.get(LocalKeys.IS_DARK);
  const theme = useThemeStore();
  theme.changeTheme(isDark ? 'dark' : 'light');
});
</script>

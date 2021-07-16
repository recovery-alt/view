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

onMounted(() => {
  const isDark = local.get(LocalKeys.IS_DARK);
  theme.value = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('theme', theme.value);
});
</script>

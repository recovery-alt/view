<template>
  <ConfigProvider :locale="lang">
    <RouterView />
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import cn from 'ant-design-vue/es/locale-provider/zh_CN';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import { ConfigProvider } from 'ant-design-vue';
import { useThemeStore } from '@/store';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });

const lang = computed(() => (locale.value === 'cn' ? cn : null));

onMounted(async () => {
  const isDark = local.get(LocalKeys.IS_DARK);
  const theme = useThemeStore();
  theme.changeTheme(isDark ? 'dark' : 'light');
});
</script>

<template>
  <ConfigProvider :locale="lang" :theme="{ algorithm: themeStore.algorithm }">
    <RouterView />
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide } from 'vue';
import cn from 'ant-design-vue/es/locale/zh_CN';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import { ConfigProvider } from 'ant-design-vue';
import { useThemeStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { theme } from 'ant-design-vue';

const { locale } = useI18n({ useScope: 'global' });
const themeStore = useThemeStore();
const { token } = theme.useToken();
const lang = computed(() => (locale.value === 'cn' ? cn : void 0));

function switchLocale() {
  locale.value = locale.value === 'en' ? 'cn' : 'en';
}

provide('switchLocale', switchLocale);

onMounted(async () => {
  const isDark = local.get(LocalKeys.IS_DARK);
  themeStore.changeTheme(isDark ? 'dark' : 'light');
});
</script>

<style lang="less">
@import 'normalize.css';
@import 'animate.css';

::-webkit-scrollbar {
  @apply w-4px h-4px;
}

::-webkit-scrollbar-track {
  box-shadow: inset v-bind('token.boxShadow');
  border-radius: v-bind('token.borderRadius');
  background: v-bind('token.colorWhite');
}

::-webkit-scrollbar-corner {
  background: v-bind('token.colorWhite');
}

::-webkit-scrollbar-thumb {
  border-radius: v-bind('token.borderRadius');
  box-shadow: inset v-bind('token.boxShadow');
  background-color: v-bind('token.colorBgContainer');
}

::-webkit-scrollbar-thumb:hover {
  background: v-bind('token.colorBgTextHover');
}

html,
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
  @apply h-full overflow-hidden;
}

#app {
  @apply h-full select-none;
}
</style>

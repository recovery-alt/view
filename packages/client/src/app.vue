<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import ZhCN from 'ant-design-vue/es/locale/zh_CN';

export default {
  setup() {
    return { locale: ZhCN };
  },
};
</script>

<style lang="less">
html,
body {
  height: 100%;
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
}

#app {
  height: 100%;
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>

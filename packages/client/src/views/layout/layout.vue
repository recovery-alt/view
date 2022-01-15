<template>
  <Layout class="flex h-full">
    <LayoutSider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <img width="40" height="40" src="/src/assets/img/logo.svg" />
      </div>
      <Menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <MenuItem
          v-for="item in routeList"
          :key="item.key"
          @click="$router.push({ name: item.key })"
        >
          <component :is="item.icon" />
          <span>{{ t(item.key) }}</span>
        </MenuItem>
      </Menu>
    </LayoutSider>
    <div class="main">
      <LayoutHeader class="layout-header">
        <MenuUnfoldOutlined v-if="collapsed" class="trigger" @click="collapsed = !collapsed" />
        <MenuFoldOutlined v-else class="trigger" @click="collapsed = !collapsed" />
        <ExitDropdown />
      </LayoutHeader>
      <LayoutContent class="layout-content">
        <RouterView />
      </LayoutContent>
    </div>
  </Layout>
</template>
<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import ExitDropdown from './exit-dropdown.vue';
import { ref } from 'vue';
import { routeList } from '@/router';
import { Layout, LayoutSider, Menu, MenuItem, LayoutHeader, LayoutContent } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { layout as messages } from '@/locales';

const selectedKeys = ref(['page']);
const collapsed = ref(false);
const { t } = useI18n({ useScope: 'local', messages });
</script>

<style lang="less" scoped>
.main {
  background-color: @layout-body-background;
  @apply flex flex-col flex-1;
}

.logo {
  color: @text-color;
  @apply flex justify-center items-center p-8px;
}

.layout-header {
  background: @component-background;
  color: @text-color;
  @apply p-10px text-20px flex justify-between items-center;
}

.layout-content {
  background: @component-background;
  @apply flex-1 mx-16px my-24px p-24px min-h-280px;
}
</style>

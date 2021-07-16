<template>
  <Layout class="container">
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
          <span>{{ item.name }}</span>
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
import { ExitDropdown } from '@/components';
import { ref } from 'vue';
import { routeList } from '@/router';
import { Layout, LayoutSider, Menu, MenuItem, LayoutHeader, LayoutContent } from 'ant-design-vue';

const selectedKeys = ref(['page']);
const collapsed = ref(false);
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: var(--component-bg);
}

.logo {
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.layout-header {
  background: var(--body-bg);
  padding: 10px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout-content {
  flex: 1;
  background: var(--body-bg);
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
}
</style>

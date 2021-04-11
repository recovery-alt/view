<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <img width="40" height="40" src="/src/assets/img/logo.svg" />
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <UserOutlined />
          <span>nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <VideoCameraOutlined />
          <span>nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <UploadOutlined />
          <span>nav 3</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <MenuUnfoldOutlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <MenuFoldOutlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <exit-dropdown />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <a-table bordered size="small" :data-source="pages" :columns="columns" row-key="_id">
          <template #width="{ text }"> {{ text }}px </template>
          <template #height="{ text }"> {{ text }}px </template>
          <template #action="{ record }">
            <a @click="toEdit(record._id)">查看</a>
            <a-divider type="vertical" />
            <a @click="toEdit(record._id)">修改</a>
          </template>
        </a-table>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useManage } from '@/hooks';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import { ExitDropdown } from '@/components';
import { generateColumns } from '@/utils';
import { ref } from 'vue';

const { pages } = useManage();
const router = useRouter();

const columns = generateColumns([
  {
    title: '作者',
    key: 'author',
  },
  {
    title: '描述',
    key: 'description',
  },
  {
    title: '标题',
    key: 'title',
  },
  {
    title: '模式',
    key: 'pageMode',
  },
  {
    title: '宽',
    key: 'width',
  },
  {
    title: '高',
    key: 'height',
  },
  {
    title: '操作',
    key: 'action',
  },
]);
const selectedKeys = ref(['1']);
const collapsed = ref(false);

const toEdit = (id: string) => {
  router.push({ path: `/editor/${id}`, params: { id } });
};
</script>

<style lang="less" scoped>
.logo {
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.layout-header {
  background: var(--body-background);
  padding: 0 10px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout-content {
  background: var(--body-background);
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
}

:deep.ant-layout {
  height: 100%;
}
</style>

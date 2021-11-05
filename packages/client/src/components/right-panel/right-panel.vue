<template>
  <section class="right-panel" :style="{ width }">
    <Tabs v-if="curComponent" v-model="activeTab" type="card" size="small">
      <TabPane v-for="item in tabs" :key="item.title">
        <template #tab>
          <span>{{ item.title }}</span>
        </template>
        <template v-if="gallery">
          <h2 class="right-panel__title">{{ gallery.name }}</h2>
          <h3 class="right-panel__subtitle">v{{ gallery.version }} | {{ gallery.name }}</h3>
        </template>
        <h2 v-else class="right-panel__title">组容器</h2>

        <component :is="item.component" />
      </TabPane>
    </Tabs>
    <PageConfig v-else-if="panel.config" />
  </section>
</template>

<script lang="ts" setup>
import type { Gallery } from '@/typings';
import type { Component } from 'vue';
import { ref, computed, watchEffect } from 'vue';
import { AttrPanel, AnimatePanel, DataPanel, PageConfig } from '@/components';
import { panel } from '@/hooks';
import { useStore } from '@/store';
import { getGallery } from '@/gallery';
import { Tabs, TabPane } from 'ant-design-vue';

const store = useStore();
const { board } = store.state;

// 当前选中组件
const curComponent = computed(() =>
  board.selected.length === 1 ? board.data[board.selected[0]] : null
);

const gallery = ref<Gallery>();
const tabs = ref<Array<{ title: string; component: Component }>>();
const activeTab = ref(tabs.value?.[0].title);
const width = computed(() => (panel.config ? '332px' : '0'));

watchEffect(() => {
  if (!curComponent.value) return;
  const { component } = curComponent.value;
  gallery.value = getGallery(component);
});

watchEffect(() => {
  if (!gallery.value) return;
  const tabsData = [
    { title: '配置', component: AttrPanel },
    { title: '数据', component: DataPanel },
    { title: '动画', component: AnimatePanel },
  ];
  gallery.value.dataConfig || tabsData.splice(1, 1);
  tabs.value = tabsData;
});
</script>

<style lang="less">
.right-panel {
  position: relative;
  border-left: 1px solid @border-color-base;
  box-sizing: border-box;
  box-shadow: @box-shadow-base;
  transition: width 0.3s @ease-in-out;
  overflow: auto;
  z-index: 90;
  background-color: @component-background;
  color: @text-color;

  &__title {
    font-size: 14px;
    padding-bottom: 3px;
    padding-left: 10px;
    padding-right: 5px;
    margin-bottom: 0;
    color: @text-color;
  }

  &__subtitle {
    font-size: 12px;
    color: @text-color-secondary;
    font-weight: normal;
    padding-left: 10px;
    padding-right: 5px;
    margin-bottom: 5px;
  }

  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-left: 27px;
  }

  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }

  .ant-input-number {
    width: 100%;
  }

  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-tabs-nav {
    width: 100%;

    & > div {
      display: flex;

      .ant-tabs-tab {
        text-align: center;
        flex: 1;
      }
    }
  }

  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    margin-right: 0;
    border-top: 2px solid @layout-body-background;
    border-radius: 0;
  }

  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    border-top: 2px solid @primary-color;
  }
}
</style>

<template>
  <section class="right-panel" :style="{ width }">
    <a-tabs v-if="curComponent" v-model="activeTab" type="card" size="small">
      <a-tab-pane v-for="item in tabs" :key="item.title">
        <template #tab>
          <span>{{ item.title }}</span>
        </template>
        <h2 class="right-panel__title">{{ gallery?.name }}</h2>
        <h3 class="right-panel__subtitle">v{{ gallery?.version }} | {{ gallery?.name }}</h3>
        <component :is="item.component" />
      </a-tab-pane>
    </a-tabs>
    <page-config v-else-if="panel.config" />
  </section>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { AttrPanel, AnimatePanel, DataPanel, PageConfig } from '@/components';
import { panel } from '@/hooks';
import { useStore } from '@/store';
import { getGalleryList } from '@/gallery';

const store = useStore();
const { board } = store.state;

// 当前选中组件
const curComponent = computed(() =>
  board.selected.length === 1 ? board.data[board.selected[0]] : null
);

const tabs = computed(() => {
  const tabs = [
    { title: '配置', component: AttrPanel },
    { title: '数据', component: DataPanel },
    { title: '动画', component: AnimatePanel },
  ];
  curComponent.value?.dataConfig || tabs.splice(1, 1);
  return tabs;
});

const activeTab = ref(tabs.value[0].title);

const width = computed(() => (panel.config ? '332px' : '0'));

const gallery = computed(() => {
  if (!curComponent.value) return;
  const galleryList = getGalleryList();
  const type = curComponent.value.component.slice(3);
  return galleryList.find(gallery => gallery.type === type);
});
</script>

<style lang="less">
.right-panel {
  position: relative;
  border-left: 1px solid var(--border-color-base);
  box-sizing: border-box;
  box-shadow: var(--box-shadow-base);
  transition: width 0.3s var(--ease-in-out);
  overflow: auto;
  z-index: 90;
  background-color: var(--body-background);

  &__title {
    font-size: 14px;
    padding-bottom: 3px;
    padding-left: 10px;
    padding-right: 5px;
    margin-bottom: 0;
  }

  &__subtitle {
    font-size: 12px;
    color: var(--text-color-secondary);
    font-weight: normal;
    padding-left: 10px;
    padding-right: 5px;
    margin-bottom: 5px;
  }
}
</style>

<template>
  <section class="right-panel" :style="{ width }">
    <Tabs v-if="board.curCom" v-model:activeKey="activeTab" type="card" size="small">
      <TabPane v-for="item in tabs" :key="item.key">
        <template #tab>
          <span>{{ t(item.key) }}</span>
        </template>
        <template v-if="cloneGallery">
          <h2 class="right-panel__title">{{ gt(`gallery.${cloneGallery.name}`) }}</h2>
          <h3 class="right-panel__subtitle">
            v{{ cloneGallery.version }} | {{ gt(`gallery.${cloneGallery.name}`) }}
          </h3>
        </template>
        <h2 v-else class="right-panel__title">{{ t('container') }}</h2>

        <component :is="item.component" />
      </TabPane>
    </Tabs>
    <PageConfig v-else-if="panel.config" />
  </section>
</template>

<script lang="ts" setup>
import type { Gallery } from '@/typings';
import type { Component } from 'vue';
import { shallowRef, ref, computed, watchEffect } from 'vue';
import { AttrPanel, AnimatePanel, DataPanel, PageConfig } from '@/components';
import { useBoardStore, usePanelStore, useGalleryStore } from '@/store';
import { Tabs, TabPane } from 'ant-design-vue';
import { rightPanel as messages } from '@/locales';
import { useI18n } from 'vue-i18n';

const board = useBoardStore();
const panel = usePanelStore();
const gallery = useGalleryStore();
const { t } = useI18n({ useScope: 'local', messages });
const { t: gt } = useI18n({ useScope: 'global' });

const cloneGallery = ref<Gallery>();
const tabs = shallowRef<Array<{ key: string; component: Component }>>([]);
const activeTab = ref(tabs.value[0]?.key);
const width = computed(() => (panel.config ? '332px' : '0'));

watchEffect(() => {
  if (!board.curCom) return;
  const { component } = board.curCom;
  cloneGallery.value = gallery.getGallery(component);
});

watchEffect(() => {
  if (!cloneGallery.value) return;
  const tabsData = [
    { key: 'config', component: AttrPanel },
    { key: 'data', component: DataPanel },
    { key: 'animation', component: AnimatePanel },
  ];
  cloneGallery.value.dataConfig || tabsData.splice(1, 1);
  tabs.value = tabsData;
});
</script>

<style lang="less">
.right-panel {
  border-left: 1px solid @border-color-base;
  box-shadow: @box-shadow-base;
  transition: width 0.3s @ease-in-out;
  background-color: @component-background;
  color: @text-color;
  @apply relative box-border overflow-auto z-90;

  &__title {
    color: @text-color;
    @apply text-14px pb-3px pl-10px pr-5px mb-0;
  }

  &__subtitle {
    color: @text-color-secondary;
    @apply text-12px font-normal pl-10px pr-5px mb-5px;
  }

  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    @apply pl-18px;
  }

  .ant-collapse-content > .ant-collapse-content-box {
    @apply p-0;
  }

  .ant-input-number {
    @apply w-full;
  }

  .ant-form-item {
    @apply mb-0;
  }

  .ant-tabs-nav-list {
    @apply w-full flex;

    .ant-tabs-tab {
      border-top: 2px solid @layout-body-background;
      @apply flex-1 flex items-center justify-center mr-0 rounded-none;

      &.ant-tabs-tab-active {
        border-top: 2px solid @primary-color;
      }
    }
  }
}
</style>

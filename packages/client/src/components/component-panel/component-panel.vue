<template>
  <section :class="['component-panel', panel.component ? 'w-233px' : 'w-0 border-0']">
    <header class="component-panel__header">
      <div>{{ t('componentList') }}</div>
      <LeftOutlined class="cursor-pointer" @click="panel.switchPanelShow('component')" />
    </header>
    <div class="p-5px">
      <InputSearch
        v-show="panel.component"
        size="small"
        enter-button
        allow-clear
        :placeholder="t('placeholder')"
        @search="searchComponent"
      />
    </div>
    <Tabs v-model:activeKey="activeTab" tab-position="left">
      <TabPane v-for="tab in filterGroup" :key="tab.groupName">
        <template #tab>
          <div class="component-panel__label">
            <component :is="tab.icon" />
            <span>{{ t(tab.groupName) }}</span>
          </div>
        </template>
        <Empty v-if="tab.list.length === 0" :description="t('empty')" />
        <ul v-else class="box-border p-5px grid grid-cols-2 mb-0">
          <li
            v-for="item in tab.list"
            :key="item.name"
            draggable="true"
            class="component-panel__item"
            :data-type="item.name"
            :data-label="gt(`gallery.${item.name}`)"
            @dragstart="handleDragStart"
            @click="handleClick"
          >
            <header>{{ gt(`gallery.${item.name}`) }}</header>
            <img
              class="w-full pointer-events-none h-[calc(100%-22px)]"
              :src="getImgSrc(item.name)"
            />
          </li>
        </ul>
      </TabPane>
    </Tabs>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import { usePanelStore, useBoardStore } from '@/store';
import { InputSearch, Tabs, TabPane, Empty, theme } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { componentPanel as messages } from '@/locales';
import { getImgSrc } from '@/gallery';
import { useSearch } from './hook';

const { t } = useI18n({ useScope: 'local', messages });
const { t: gt } = useI18n({ useScope: 'global' });
const activeTab = ref('basic');
const panel = usePanelStore();
const board = useBoardStore();
const { token } = theme.useToken();
const { filterGroup, searchComponent } = useSearch();

function handleDragStart(e: DragEvent) {
  const target = e.target as HTMLDataListElement;
  const { type, label } = target.dataset;
  if (type && label) {
    e.dataTransfer?.setData('type', type);
    e.dataTransfer?.setData('label', label);
  }
}

function handleClick(e: MouseEvent) {
  const target = e.currentTarget as HTMLDataListElement;
  const { type, label } = target.dataset;
  let top = 100;
  let left = 100;
  if (board.curCom?.style) {
    top = board.curCom.style.top;
    left = board.curCom.style.left;
  }
  top = top + 20;
  left = left + 20;
  board.append({ type, label, left, top });
}
</script>

<style lang="less">
.component-panel {
  background-color: v-bind('token.colorBgBase');
  transition: width 0.3s v-bind('token.motionEaseInOut');
  color: v-bind('token.colorText');
  border-right: 1px solid v-bind('token.colorBorder');
  @apply flex-shrink-0 box-border z-4 whitespace-nowrap;

  .ant-tabs {
    &.ant-tabs-left {
      @apply h-full;

      > .ant-tabs-nav .ant-tabs-tab {
        @apply px-10px py-4px;

        padding: 4px 10px;
      }

      > .ant-tabs-content-holder > .ant-tabs-content {
        @apply h-full;

        > .ant-tabs-tabpane {
          @apply pl-0 overflow-y-auto;
        }
      }
    }
  }

  &__header {
    background-color: v-bind('token.colorBgLayout');
    @apply h-30px flex items-center justify-between box-border px-10px;
  }

  &__item {
    @apply w-80px h-80px;

    header {
      background-color: v-bind('token.colorBgBase');
      border-bottom: 1px solid v-bind('token.colorBorder');
      @apply h-22px box-border px-5px text-center;
    }

    img {
      background-color: v-bind('token.colorInfoBg');
    }
  }

  &__label {
    @apply flex flex-col justify-center items-center;

    .anticon {
      @apply mr-0 mt-6px text-16px;
    }
  }
}
</style>

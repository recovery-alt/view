<template>
  <section
    class="component-panel"
    :class="{ 'component-panel--hide': !panel.component }"
    @dragstart="handleDragStart"
  >
    <header class="component-panel__header">
      <div>组件列表</div>
      <LeftOutlined @click="panel.component = !panel.component" />
    </header>
    <div class="component-panel__select-box">
      <a-input-search
        v-show="panel.component"
        enter-button
        placeholder="请输入组件名"
        @search="searchComponent"
      />
    </div>
    <a-tabs v-model:activeKey="activeTab" tab-position="left">
      <a-tab-pane v-for="tab in galleryGroup" :key="tab.groupName">
        <template #tab>
          <div class="component-panel__label">
            <component :is="tab.icon" />
            <span>{{ tab.groupName }}</span>
          </div>
        </template>
        <ul class="component-panel__list">
          <li
            v-for="item in tab.list"
            :key="item.type"
            draggable="true"
            class="component-panel__item"
            :data-type="item.type"
          >
            <header>{{ item.name }}</header>
            <section></section>
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { getGalleryGroup } from '@/gallery';
import { ref } from 'vue';
import {
  DatabaseOutlined,
  FolderOutlined,
  LineChartOutlined,
  BankOutlined,
  LeftOutlined,
} from '@ant-design/icons-vue';
import { panel } from '@/hooks';

export default {
  name: 'component-panel',
  components: { DatabaseOutlined, FolderOutlined, LineChartOutlined, BankOutlined, LeftOutlined },
  setup() {
    const store = useStore();

    const board = store.state.board;

    const activeTab = ref('基础');

    const galleryGroup = getGalleryGroup();

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLDataListElement;
      if (target.dataset.type) {
        e.dataTransfer?.setData('type', target.dataset.type);
      }
    };

    const searchComponent = () => {
      // TODO: 查询组件
    };

    return { handleDragStart, board, galleryGroup, activeTab, panel, searchComponent };
  },
};
</script>

<style lang="less">
.component-panel {
  width: 233px;
  flex-shrink: 0;
  box-sizing: border-box;
  z-index: 4;
  background-color: var(--body-background);
  transition: width 0.3s var(--ease-in-out);
  white-space: nowrap;

  &--hide {
    width: 0;
    border: 0;
  }

  &__header {
    height: 30px;
    background-color: var(--heading-bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;

    span {
      cursor: pointer;
    }
  }

  &__select-box {
    padding: 5px;
  }

  &__list {
    height: calc(100% - 30px);
    box-sizing: border-box;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 0;
    overflow: auto;
  }

  &__item {
    width: 80px;
    height: 80px;
    margin-bottom: 6px;
    cursor: pointer;

    header {
      height: 22px;
      box-sizing: border-box;
      padding: 0 5px;
      background-color: var(--heading-bg);
      text-align: center;
    }

    section {
      background-image: url('//img.alicdn.com/tfs/TB1KUHnlQY2gK0jSZFgXXc5OFXa-160-116.png');
      background-size: cover;
      pointer-events: none;
      height: calc(100% - 22px);
    }
  }

  &__label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      margin-top: 6px;
      font-size: 16px;
    }
  }
}
</style>

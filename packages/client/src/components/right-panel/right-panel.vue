<template>
  <section class="right-panel" :style="{ width }">
    <a-tabs v-if="curComponent" v-model="activeTab" size="small">
      <a-tab-pane v-for="item in tabs" :key="item.title">
        <template #tab>
          <span>{{ item.title }}</span>
        </template>
        <component :is="item.component" />
      </a-tab-pane>
    </a-tabs>
    <page-config v-else-if="panel.config" />
  </section>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { AttrPanel, AnimatePanel, DataPanel, PageConfig } from '@/components';
import { panel } from '@/hooks';
import { useStore } from '@/store';

export default {
  name: 'right-panel',
  components: {
    AttrPanel,
    AnimatePanel,
    DataPanel,
    PageConfig,
  },
  setup() {
    const store = useStore();
    const { board } = store.state;

    // 当前选中组件
    const curComponent = computed(() =>
      board.selected.length === 1 ? board.data[board.selected[0]] : null
    );

    const tabs = [
      { title: '配置', component: 'attr-panel' },
      { title: '数据', component: 'data-panel' },
      { title: '动画', component: 'animate-panel' },
    ];

    const activeTab = ref(tabs[0].title);

    const toggle = () => {
      panel.config = !panel.config;
    };

    const width = computed(() => (panel.config ? '332px' : '0'));

    return {
      board,
      curComponent,
      tabs,
      activeTab,
      toggle,
      width,
      panel,
    };
  },
};
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
  background-color: var(--component-background);
}

.animation {
  &-box {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    &_item {
      width: 120px;
      margin-left: 20px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      div {
        display: block;
        content: '';
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 40px solid var(--primary-8);
        margin-bottom: 10px;
      }
    }
  }

  &-list {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      margin-top: 10px;
    }
  }

  &-btn_group {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    button:first-child {
      margin-right: 10px;
    }
  }
}
</style>

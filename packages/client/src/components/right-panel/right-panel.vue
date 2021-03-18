<template>
  <section class="right-panel" :style="{ width }">
    <a-tabs v-if="curComponent" v-model="activeName" size="small">
      <a-tab-pane key="style">
        <template #tab>
          <span>样式</span>
        </template>
        <attr-panel />
      </a-tab-pane>
      <a-tab-pane key="animation">
        <template #tab>
          <span>动画</span>
        </template>
        <div class="animation-btn_group">
          <a-button type="primary" @click="drawer.show = true">
            <template #icon><PlusOutlined /></template>
            添加
          </a-button>
          <a-button type="primary" @click="previewAnimation(curComponent, board.selected[0])">
            <template #icon><PlayCircleOutlined /></template>
            预览
          </a-button>
        </div>
        <animate-panel />
      </a-tab-pane>
    </a-tabs>
    <page-config v-else-if="panel.config" />
  </section>
  <a-drawer v-model:visible="drawer.show" placement="right" :width="400">
    <a-tabs v-model="drawer.selected" size="small">
      <a-tab-pane v-for="item in drawer.data" :key="item.title" :label="item.title">
        <template #tab>{{ item.title }}</template>
        <ul class="animation-box">
          <li
            v-for="animation in item.data"
            :key="animation.name"
            class="animation-box_item"
            @mouseover="handleMouseover(animation.name)"
            @mouseleave="handleMouseleave"
            @click="addAnimation(animation.name)"
          >
            <div :class="getAnimationClass(animation.name)" />
            {{ animation.label }}
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { AttrPanel, AnimatePanel, PageConfig } from '@/components';
import { panel, useAnimation } from '@/hooks';
import { useStore } from '@/store';
import { PlusOutlined, PlayCircleOutlined } from '@ant-design/icons-vue';

export default {
  name: 'right-panel',
  components: {
    AttrPanel,
    AnimatePanel,
    PlusOutlined,
    PlayCircleOutlined,
    PageConfig,
  },
  setup() {
    const store = useStore();
    const { board } = store.state;

    // 当前选中组件
    const curComponent = computed(() =>
      board.selected.length === 1 ? board.data[board.selected[0]] : null
    );

    const activeName = ref('style');
    const {
      drawer,
      handleMouseover,
      handleMouseleave,
      getAnimationClass,
      addAnimation,
      previewAnimation,
    } = useAnimation(store);

    const toggle = () => {
      panel.config = !panel.config;
    };

    const width = computed(() => (panel.config ? '332px' : '0'));

    return {
      board,
      curComponent,
      activeName,
      toggle,
      width,
      drawer,
      handleMouseover,
      handleMouseleave,
      getAnimationClass,
      addAnimation,
      previewAnimation,
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
  user-select: none;
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

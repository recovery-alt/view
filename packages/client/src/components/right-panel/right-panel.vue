<template>
  <section class="main-right" :style="{ width: width }">
    <a-tabs v-if="curComponent" v-model="activeName">
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
            <template #icon><plus-outlined /></template>
            添加
          </a-button>
          <a-button type="primary" @click="previewAnimation(curComponent, board.selected[0])">
            <template #icon><play-circle-outlined /></template>
            预览
          </a-button>
        </div>
        <animate-panel />
      </a-tab-pane>
    </a-tabs>
    <a-empty v-else-if="!isFold" description="请选中你的组件" />
    <div class="main-right_fold" @click="toggle">
      <double-left-outlined v-if="isFold" />
      <double-right-outlined v-else />
    </div>
  </section>
  <a-drawer v-model:visible="drawer.show" placement="right" :width="400">
    <a-tabs v-model="drawer.selected">
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
import AttrPanel from './attr-panel.vue';
import { useAnimation } from '@/hooks';
import { useStore } from '@/store';
import AnimatePanel from './animate-panel.vue';
import {
  PlusOutlined,
  PlayCircleOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'right-panel',
  components: {
    AttrPanel,
    AnimatePanel,
    PlusOutlined,
    PlayCircleOutlined,
    DoubleRightOutlined,
    DoubleLeftOutlined,
  },
  setup() {
    const store = useStore();
    const { board } = store.state;

    // 当前选中组件
    const curComponent = computed(() => {
      return board.selected.length === 1 ? board.data[board.selected[0]] : null;
    });

    const activeName = ref('style');
    const {
      drawer,
      handleMouseover,
      handleMouseleave,
      getAnimationClass,
      addAnimation,
      previewAnimation,
    } = useAnimation(store);

    const isFold = ref(false);

    const toggle = () => {
      isFold.value = !isFold.value;
    };

    const width = computed(() => (isFold.value ? '0' : '300px'));

    return {
      board,
      curComponent,
      activeName,
      isFold,
      toggle,
      width,
      drawer,
      handleMouseover,
      handleMouseleave,
      getAnimationClass,
      addAnimation,
      previewAnimation,
    };
  },
};
</script>

<style lang="less" scoped>
.main-right {
  position: relative;
  border-left: 1px solid @border-color-base;
  box-sizing: border-box;
  padding: 5px 0;
  box-shadow: @shadow-color;
  transition: all 0.3s ease-in-out;
  overflow: auto;

  &_fold {
    position: absolute;
    top: 50%;
    left: -20px;
    width: 20px;
    height: 100px;
    margin-top: -50px;
    box-shadow: @shadow-color;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #fff;
    font-size: 18px;
  }
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
        border-bottom: 40px solid @primary-8;
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

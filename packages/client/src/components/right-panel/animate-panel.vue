<template>
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
  <a-collapse v-if="curComponent.animations && curComponent.animations.length > 0" v-model="active">
    <a-collapse-panel v-for="animation in curComponent.animations" :key="animation">
      <template #header>
        <div class="animation-title">
          <span>{{ animation }}</span>
          <div class="animation-title__right">
            <a-button size="small" type="primary" @click.stop="preview(animation)">
              <template #icon><PlayCircleOutlined /></template>
            </a-button>
            <a-button size="small" type="primary" @click.stop="del(animation)">
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </div>
        </div>
      </template>
    </a-collapse-panel>
  </a-collapse>
  <a-empty v-else description="尚未选择任何动画" />
  <a-drawer v-model:visible="drawer.show" placement="right" :width="400" :closable="false">
    <a-tabs v-model="drawer.selected" size="small">
      <a-tab-pane v-for="item in drawer.data" :key="item.title" :label="item.title">
        <template #tab>{{ item.title }}</template>
        <ul class="animation-box">
          <li
            v-for="animation in item.data"
            :key="animation.name"
            class="animation-box__item"
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

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore } from '@/store';
import { useAnimation, boardRefs } from '@/hooks';
import { PlusOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const active = ref('');

const store = useStore();
const { board } = store.state;

// 当前选中组件
const curComponent = computed(() => board.data[board.selected[0]]);

const {
  drawer,
  play,
  handleMouseover,
  handleMouseleave,
  getAnimationClass,
  addAnimation,
  previewAnimation,
} = useAnimation(store);

const preview = (name: string) => {
  const ref = boardRefs[board.selected[0]];
  play(name, ref);
};

const del = (animation: string) => {
  if (!curComponent.value.animations) return;
  const index = curComponent.value.animations.findIndex(val => val === animation);
  curComponent.value.animations.splice(index, 1);
};
</script>

<style lang="less">
.animation {
  &-title {
    width: 100%;
    display: flex;
    justify-content: space-around;

    &__right button:first-child {
      margin-right: 10px;
    }
  }
  &-box {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    &__item {
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
        border-bottom: 40px solid var(--primary-color);
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

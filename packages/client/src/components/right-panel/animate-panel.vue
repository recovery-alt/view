<template>
  <div class="animation-btn_group">
    <Button type="primary" @click="drawer.show = true">
      <template #icon><PlusOutlined /></template>
      添加
    </Button>
    <Button type="primary" @click="playAll(boardRefs[board.selected[0]])">
      <template #icon><PlayCircleOutlined /></template>
      预览
    </Button>
  </div>
  <Collapse v-if="curComponent.animations?.length" v-model="active" accordion>
    <CollapsePanel v-for="(animation, i) in curComponent.animations" :key="animation.id">
      <template #header>
        <div class="animation-title">
          <span class="animation-title__left">{{ animation.label }}</span>
          <div class="animation-title__right">
            <Button size="small" type="primary" @click.stop="play(i, boardRefs[board.selected[0]])">
              <template #icon><PlayCircleOutlined /></template>
            </Button>
            <Button size="small" type="primary" @click.stop="del(i)">
              <template #icon><DeleteOutlined /></template>
            </Button>
          </div>
        </div>
      </template>
      <Form
        label-align="right"
        :label-col="{ span: 5, offset: 2 }"
        :wrapper-col="{ span: 16, offset: 1 }"
      >
        <Item
          v-for="field in fields"
          :key="field.label"
          :field="field"
          :model="curComponent.animations[i]"
        />
      </Form>
    </CollapsePanel>
  </Collapse>
  <Empty v-else description="尚未选择任何动画" />
  <Drawer v-model:visible="drawer.show" placement="right" :width="400" :closable="false">
    <Tabs v-model="drawer.selected" size="small">
      <TabPane v-for="item in drawer.data" :key="item.title" :label="item.title">
        <template #tab>{{ item.title }}</template>
        <ul class="animation-box">
          <li
            v-for="animation in item.data"
            :key="animation.name"
            class="animation-box__item"
            @mouseover="handleMouseover(animation.name)"
            @mouseleave="handleMouseleave"
            @click="addAnimation(animation)"
          >
            <div :class="getAnimationClass(animation.name)" />
            {{ animation.label }}
          </li>
        </ul>
      </TabPane>
    </Tabs>
  </Drawer>
</template>

<script lang="ts" setup>
import type { Field } from '@/typings';
import { ref, computed } from 'vue';
import { useStore } from '@/store';
import { useAnimation, boardRefs } from '@/hooks';
import { PlusOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { FormItem as Item } from '@/components';
import { FormEnum } from '@/enum';
import {
  Button,
  Collapse,
  CollapsePanel,
  Empty,
  Drawer,
  Tabs,
  TabPane,
  Form,
} from 'ant-design-vue';

const active = ref('');

const store = useStore();
const { board } = store.state;

// 当前选中组件
const curComponent = computed(() => board.data[board.selected[0]]);

const fields: Array<Field> = [
  {
    label: '动画',
    extra: ['时长', '延迟'],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'animationDuration', propsData: { min: 0 } },
      { type: FormEnum.INPUT_NUMBER, model: 'animationDelay', propsData: { min: 0 } },
    ],
  },
  {
    label: '循环次数',
    item: { type: FormEnum.INPUT_NUMBER, model: 'animationIterationCount', propsData: { min: 1 } },
  },
];

const {
  drawer,
  play,
  playAll,
  handleMouseover,
  handleMouseleave,
  getAnimationClass,
  addAnimation,
} = useAnimation(curComponent);

const del = (index: number) => {
  if (!curComponent.value.animations) return;
  curComponent.value.animations.splice(index, 1);
};
</script>

<style lang="less">
.animation {
  &-title {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &__left {
      padding-left: 10px;
    }

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
        border-bottom: 40px solid @primary-color;
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

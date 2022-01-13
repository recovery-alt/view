<template>
  <div class="animation-btn_group">
    <Button type="primary" @click="drawer.show = true">
      <template #icon><PlusOutlined /></template>
      {{ t('add') }}
    </Button>
    <Button type="primary" @click="playAll">
      <template #icon><PlayCircleOutlined /></template>
      {{ t('preview') }}
    </Button>
  </div>
  <Collapse
    v-if="board.curCom?.animations?.length"
    v-model="active"
    class="animation-wrapper"
    accordion
  >
    <CollapsePanel v-for="(animation, i) in board.curCom?.animations" :key="animation.id">
      <template #header>
        <div class="animation-title">
          <span class="animation-title__left">{{ animation.label }}</span>
          <div class="animation-title__right">
            <Button size="small" type="primary" @click.stop="play(i)">
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
          :model="board.curCom?.animations[i]"
        />
      </Form>
    </CollapsePanel>
  </Collapse>
  <Empty v-else :description="t('tip')" />
  <Drawer v-model:visible="drawer.show" placement="right" :width="400" :closable="false">
    <Tabs v-model="drawer.selected" size="small">
      <TabPane v-for="item in drawer.data" :key="item.title" :label="item.title">
        <template #tab>{{ item.title }}</template>
        <ul class="animation-box">
          <li
            v-for="animation in item.data"
            :key="animation"
            class="animation-box__item"
            @mouseover="handleMouseover(animation)"
            @mouseleave="handleMouseleave"
            @click="addAnimation({ name: animation, label: t(`animations.${animation}`) })"
          >
            <div :class="getAnimationClass(animation)" />
            {{ t(`animations.${animation}`) }}
          </li>
        </ul>
      </TabPane>
    </Tabs>
  </Drawer>
</template>

<script lang="ts" setup>
import type { Field } from '@/typings';
import { ref } from 'vue';
import { useBoardStore } from '@/store';
import { useAnimation } from '@/components/board/hooks/animate';
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
import { animatePanel as messages } from '@/locales';
import { useI18n } from 'vue-i18n';
import { playAnimation, playAnimations } from '@/utils';

const active = ref('');
const board = useBoardStore();
const { t } = useI18n({ useScope: 'local', messages });

const fields: Array<Field> = [
  {
    label: t('animation.name'),
    extra: [t('animation.duration'), t('animation.delay')],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'animationDuration', propsData: { min: 0 } },
      { type: FormEnum.INPUT_NUMBER, model: 'animationDelay', propsData: { min: 0 } },
    ],
  },
  {
    label: t('animation.times'),
    item: { type: FormEnum.INPUT_NUMBER, model: 'animationIterationCount', propsData: { min: 1 } },
  },
];

const { drawer, handleMouseover, handleMouseleave, getAnimationClass, addAnimation } = useAnimation(
  board.curCom!
);

const del = (index: number) => {
  if (board.curCom?.animations) board.curCom?.animations.splice(index, 1);
};

function play(index: number) {
  const { refs, selected, curCom } = board;
  if (!curCom?.animations) return;
  playAnimation(refs[selected[0]], curCom.animations[index]);
}

function playAll() {
  const { refs, selected, curCom } = board;

  playAnimations(refs[selected[0]], curCom?.animations);
}
</script>

<style lang="less">
.animation {
  &-wrapper.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-title {
    width: 100%;
    display: flex;
    justify-content: space-between;

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

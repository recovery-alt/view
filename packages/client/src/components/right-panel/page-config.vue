<template>
  <div class="page-config">
    <header class="page-config__header">页面设置</header>
    <section class="page-config__wrapper">
      <Form
        :model="pageConfig"
        hide-required-mark
        label-align="right"
        :label-col="{ span: 5, offset: 2 }"
        :wrapper-col="{ span: 16, offset: 1 }"
      >
        <Item v-for="field in fields" :key="field.label" :field="field" :model="pageConfig" />
      </Form>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from '@/typings';
import { FormEnum } from '@/enum';
import { pageConfig } from '@/hooks';
import {
  ExpandOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  DragOutlined,
  StopOutlined,
} from '@ant-design/icons-vue';
import { FormItem as Item } from '@/components';
import { Form } from 'ant-design-vue';

const fields: Array<Field> = [
  {
    label: '页面标题',
    item: { type: FormEnum.INPUT, model: 'title', span: 22 },
  },
  {
    label: '页面描述',
    item: { type: FormEnum.TEXTAREA, model: 'description', span: 22 },
  },
  {
    label: '屏幕尺寸',
    extra: ['宽度', '高度'],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'width' },
      { type: FormEnum.INPUT_NUMBER, model: 'height' },
    ],
  },
  {
    label: '背景颜色',
    item: { type: FormEnum.COLOR_PICKER, model: 'backgroundColor' },
  },
  {
    label: '背景图片',
    item: { type: FormEnum.INPUT, model: 'url' },
  },
  {
    label: '缩放方式',
    item: {
      type: FormEnum.BTN_GROUP,
      model: 'zoom',
      span: 22,
      data: [
        { icon: ExpandOutlined, tip: '全屏铺满', value: 0 },
        { icon: ColumnWidthOutlined, tip: '等比缩放宽度铺满', value: 1 },
        { icon: ColumnHeightOutlined, tip: '等比缩放高度铺满', value: 2 },
        { icon: DragOutlined, tip: '等比缩放高度铺满（可滚动）', value: 3 },
        { icon: StopOutlined, tip: '不缩放', value: 4 },
      ],
    },
  },
  {
    label: '栅格间距',
    item: { type: FormEnum.INPUT_NUMBER, model: 'gap' },
  },
];
</script>

<style lang="less">
.page-config {
  &__header {
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: var(--heading-bg);
  }

  &__wrapper {
    height: calc(100% - 30px);
    overflow: auto;
  }

  &__extra {
    width: 100%;
    display: flex;

    span {
      flex: 1;
    }
  }
}
</style>

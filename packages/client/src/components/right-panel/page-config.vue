<template>
  <div class="page-config">
    <header class="page-config__header">{{ t('setting') }}</header>
    <section class="page-config__wrapper">
      <Form
        :model="page.config"
        hide-required-mark
        label-align="right"
        :label-col="{ span: 5, offset: 2 }"
        :wrapper-col="{ span: 16, offset: 1 }"
      >
        <Item v-for="field in fields" :key="field.label" :field="field" :model="page.config" />
      </Form>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from '@/typings';
import { FormEnum } from '@/enum';
import { usePageStore } from '@/store';
import {
  ExpandOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  DragOutlined,
  StopOutlined,
} from '@ant-design/icons-vue';
import { FormItem as Item } from '@/components';
import { Form } from 'ant-design-vue';
import { pageConfig as messages } from '@/locales';
import { useI18n } from 'vue-i18n';

const page = usePageStore();
const { t } = useI18n({ useScope: 'local', messages });

const fields: Array<Field> = [
  {
    label: t('title'),
    item: { type: FormEnum.INPUT, model: 'title', span: 22 },
  },
  {
    label: t('description'),
    item: { type: FormEnum.TEXTAREA, model: 'description', span: 22 },
  },
  {
    label: t('size'),
    extra: [t('width'), t('height')],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'width' },
      { type: FormEnum.INPUT_NUMBER, model: 'height' },
    ],
  },
  {
    label: t('backgroundColor'),
    item: { type: FormEnum.COLOR_PICKER, model: 'backgroundColor' },
  },
  {
    label: t('backgroundImage'),
    item: { type: FormEnum.INPUT, model: 'url' },
  },
  {
    label: t('zoom'),
    item: {
      type: FormEnum.BTN_GROUP,
      model: 'zoom',
      span: 22,
      data: [
        { icon: ExpandOutlined, tip: t('fullScreen'), value: 0 },
        { icon: ColumnWidthOutlined, tip: t('equalWidth'), value: 1 },
        { icon: ColumnHeightOutlined, tip: t('equalHeight'), value: 2 },
        { icon: DragOutlined, tip: t('equalHeightScrollable'), value: 3 },
        { icon: StopOutlined, tip: t('noZoom'), value: 4 },
      ],
    },
  },
  {
    label: t('gridGap'),
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
    background-color: @layout-body-background;
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

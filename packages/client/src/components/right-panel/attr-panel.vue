<template>
  <a-form
    label-align="right"
    :label-col="{ span: 5, offset: 2 }"
    :wrapper-col="{ span: 16, offset: 1 }"
  >
    <a-form-item label="名称">
      <a-col span="16">
        <a-input v-model:value="curComponent.label" size="small" />
      </a-col>
    </a-form-item>
    <form-item
      v-for="field in basicField"
      :key="field.label"
      :field="field"
      :model="curComponent.style"
    />
    <a-form-item label="旋转角度">
      <a-row>
        <a-col span="10">
          <a-input-number v-model:value="curComponent.style.rotate" :precision="0" size="small" />
        </a-col>
        <a-col span="3" offset="2">
          <a-button size="small" @click="rotate(true)">
            <template #icon>
              <RotateLeftOutlined />
            </template>
          </a-button>
        </a-col>
        <a-col span="3">
          <a-button size="small" @click="rotate()">
            <template #icon>
              <RotateRightOutlined />
            </template>
          </a-button>
        </a-col>
      </a-row>
    </a-form-item>
    <form-generator v-model:activeKey="activeKey" :schema="schema" :model="curComponent.style" />
  </a-form>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useStore } from '@/store';
import { FormGenerator } from '@/components';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons-vue';
import { FormEnum } from '@/enum';
import FormItem from '@/components/form-generator/form-item.vue';

const store = useStore();
const { board } = store.state;

const activeKey = ref('');

const curComponent = computed(() => board.data[board.selected[0]]);

const rotate = (reverse = false) => {
  const deg = reverse ? -45 : 45;
  curComponent.value.style.rotate += deg;
};

const basicField: Array<Field> = [
  {
    label: '尺寸',
    extra: ['宽度', '高度'],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'width' },
      { type: FormEnum.INPUT_NUMBER, model: 'height' },
    ],
  },
  {
    label: '位置',
    extra: ['x轴', 'y轴'],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'left' },
      { type: FormEnum.INPUT_NUMBER, model: 'top' },
    ],
  },
  {
    label: '透明度',
    item: [
      { type: FormEnum.SLIDER, model: 'opacity', props: { min: 0, max: 1, step: 0.1 } },
      { type: FormEnum.INPUT_NUMBER, model: 'opacity', props: { min: 0, max: 1, step: 0.1 } },
    ],
  },
];

const schema: Array<SchemaItem> = [
  {
    title: '边框&圆角',
    fields: [
      {
        label: '圆角',
        item: {
          type: FormEnum.INPUT_NUMBER,
          model: 'borderRadius',
        },
      },
      {
        label: '边框',
        extra: ['大小', '颜色'],
        item: [
          {
            type: FormEnum.INPUT_NUMBER,
            model: 'borderWidth',
          },
          {
            type: FormEnum.COLOR_PICKER,
            model: 'borderColor',
          },
        ],
      },
      {
        label: '边框线型',
        item: {
          type: FormEnum.SELECT,
          model: 'borderStyle',
          data: [
            { id: 'none', label: '无边框' },
            { id: 'dotted', label: '点状' },
            { id: 'dashed', label: '虚线' },
            { id: 'solid', label: '实线' },
          ],
        },
      },
    ],
  },
  {
    title: '字体',
    fields: [
      {
        label: '字体',
        extra: ['大小', '粗细'],
        item: [
          { model: 'fontSize', type: FormEnum.INPUT_NUMBER, default: 14 },
          {
            model: 'fontWeight',
            type: FormEnum.INPUT_NUMBER,
            default: 500,
            props: { step: 100, min: 100, max: 900 },
          },
        ],
      },
      {
        label: '文字',
        extra: ['行高', '间距'],
        item: [
          {
            model: 'lineHeight',
            type: FormEnum.INPUT_NUMBER,
            default: 1,
            props: { step: 0.1 },
          },
          {
            model: 'letterSpacing',
            type: FormEnum.INPUT_NUMBER,
            default: 0,
          },
        ],
      },
    ],
  },
  {
    title: '颜色',
    fields: [
      {
        label: '颜色',
        extra: ['字体颜色', '背景色'],
        item: [
          {
            model: 'color',
            type: FormEnum.COLOR_PICKER,
          },
          {
            model: 'backgroundColor',
            type: FormEnum.COLOR_PICKER,
          },
        ],
      },
    ],
  },
];

watchEffect(() => {
  if (board.selected.length === 1) {
    const setVal = (val: FieldItem) => {
      if (val.default !== undefined && !style[val.model]) style[val.model] = val.default;
    };
    const { style } = board.data[board.selected[0]];
    schema.forEach(val => {
      val.fields.forEach(field => {
        const { item } = field;
        Array.isArray(item) ? item.forEach(setVal) : setVal(item);
      });
    });
  }
});
</script>

<style lang="less">
.attr-panel {
  &__extra {
    width: 100%;
    display: flex;

    span {
      font-size: 12px;
      flex: 1;
    }
  }
}
</style>

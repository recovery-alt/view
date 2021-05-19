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
    <a-collapse v-model:activeKey="activeKey" expand-icon-position="right" size="small">
      <a-collapse-panel
        v-for="item in schema"
        :key="item.title"
        :title="item.title"
        :header="item.title"
      >
        <form-item
          v-for="field in item.fields"
          :key="field.label"
          :field="field"
          :model="curComponent.style"
        />
      </a-collapse-panel>
      <a-collapse-panel
        v-for="item in gallery?.attr"
        :key="item.title"
        :title="item.title"
        :header="item.title"
      >
        <form-item
          v-for="field in item.fields"
          :key="field.label"
          :field="field"
          :model="curComponent.propsData"
        />
      </a-collapse-panel>
    </a-collapse>
  </a-form>
</template>

<script lang="ts" setup>
import type { Gallery, Field, SchemaItem, FieldItem, Data } from '@/typings';
import { computed, ref, shallowRef, watchEffect } from 'vue';
import { useStore } from '@/store';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from '@ant-design/icons-vue';
import { FormEnum } from '@/enum';
import FormItem from '@/components/form-generator/form-item.vue';
import { getGallery } from '@/gallery';

const store = useStore();
const { board } = store.state;

const activeKey = ref('');

const curComponent = computed(() => board.data[board.selected[0]]);

const rotate = (reverse = false) => {
  const deg = reverse ? -45 : 45;
  curComponent.value.style.rotate += deg;
};

const gallery = shallowRef<Gallery>();

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
      { type: FormEnum.SLIDER, model: 'opacity', propsData: { min: 0, max: 1, step: 0.1 } },
      { type: FormEnum.INPUT_NUMBER, model: 'opacity', propsData: { min: 0, max: 1, step: 0.1 } },
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
            propsData: { step: 100, min: 100, max: 900 },
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
            propsData: { step: 0.1 },
          },
          {
            model: 'letterSpacing',
            type: FormEnum.INPUT_NUMBER,
            default: 0,
          },
        ],
      },
      {
        label: '水平对齐',
        item: {
          model: 'textAlign',
          type: FormEnum.BTN_GROUP,
          data: [
            { icon: AlignLeftOutlined, tip: '居左', value: 'left' },
            { icon: AlignCenterOutlined, tip: '居中', value: 'center' },
            { icon: AlignRightOutlined, tip: '居右', value: 'right' },
          ],
        },
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

const setDefaultVal = (val: FieldItem | Array<FieldItem>, data: Data<string | number>) => {
  const setVal = (val: FieldItem) => {
    if (val.default !== undefined && data[val.model] === undefined) {
      data[val.model] = val.default;
    }
  };
  Array.isArray(val) ? val.forEach(item => setVal(item)) : setVal(val);
};

watchEffect(() => {
  if (board.selected.length === 1) {
    const { style } = board.data[board.selected[0]];
    schema.forEach(val => {
      val.fields.forEach(field => {
        const { item } = field;
        setDefaultVal(item, style as unknown as Data<string | number>);
      });
    });
  }
});

watchEffect(() => {
  if (!curComponent.value) return;
  const { component, propsData } = curComponent.value;
  gallery.value = getGallery(component);
  if (!gallery.value) return;
  const { attr } = gallery.value;
  if (board.selected.length === 1 && attr && propsData) {
    attr.forEach(item => {
      item.fields.forEach(field => {
        setDefaultVal(field.item, propsData);
      });
    });
  }
});
</script>

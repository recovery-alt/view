<template>
  <Form
    label-align="right"
    :label-col="{ span: 5, offset: 2 }"
    :wrapper-col="{ span: 16, offset: 1 }"
  >
    <FormItem :label="t('name')">
      <Col span="16">
        <Input v-model:value="board.curCom!.label" size="small" />
      </Col>
    </FormItem>
    <Item
      v-for="field in basicField"
      :key="field.label"
      :field="field"
      :model="board.curCom?.style"
    />
    <FormItem :label="t('angle')">
      <Row>
        <Col span="10">
          <InputNumber v-model:value="board.curCom!.style.rotate" :precision="0" size="small" />
        </Col>
        <Col span="3" offset="2">
          <Button size="small" @click="rotate(true)">
            <template #icon>
              <RotateLeftOutlined />
            </template>
          </Button>
        </Col>
        <Col span="3">
          <Button size="small" @click="rotate()">
            <template #icon>
              <RotateRightOutlined />
            </template>
          </Button>
        </Col>
      </Row>
    </FormItem>
    <Collapse v-model:activeKey="activeKey" expand-icon-position="right" size="small">
      <CollapsePanel
        v-for="item in schema"
        :key="item.title"
        :title="item.title"
        :header="item.title"
      >
        <Item
          v-for="field in item.fields"
          :key="field.label"
          :field="field"
          :model="board.curCom?.style"
        />
      </CollapsePanel>
      <CollapsePanel
        v-for="item in cloneGallery?.attr"
        :key="item.title"
        :title="item.title"
        :header="item.title"
      >
        <Item
          v-for="field in item.fields"
          :key="field.label"
          :field="field"
          :model="board.curCom?.propsData"
        />
      </CollapsePanel>
    </Collapse>
  </Form>
</template>

<script lang="ts" setup>
import type { Gallery, Field, SchemaItem, FieldItem, Data } from '@/typings';
import { computed, ref, shallowRef, watchEffect } from 'vue';
import { useBoardStore, useGalleryStore } from '@/store';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from '@ant-design/icons-vue';
import { FormEnum } from '@/enum';
import Item from '@/components/form-generator/form-item.vue';
import {
  Form,
  FormItem,
  Col,
  Row,
  Collapse,
  CollapsePanel,
  Input,
  InputNumber,
  Button,
} from 'ant-design-vue';
import { attrPanel as messages } from '@/locales';
import { useI18n } from 'vue-i18n';

const board = useBoardStore();
const gallery = useGalleryStore();
const activeKey = ref('');
const { t } = useI18n({ useScope: 'local', messages });

const rotate = (reverse = false) => {
  const deg = reverse ? -45 : 45;
  board.curCom!.style.rotate += deg;
};

const cloneGallery = shallowRef<Gallery>();

const basicField = computed<Array<Field>>(() => [
  {
    label: t('size'),
    extra: [t('width'), t('height')],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'width' },
      { type: FormEnum.INPUT_NUMBER, model: 'height' },
    ],
  },
  {
    label: t('position'),
    extra: [t('xAxis'), t('yAxis')],
    item: [
      { type: FormEnum.INPUT_NUMBER, model: 'left' },
      { type: FormEnum.INPUT_NUMBER, model: 'top' },
    ],
  },
  {
    label: t('opacity'),
    item: [
      { type: FormEnum.SLIDER, model: 'opacity', propsData: { min: 0, max: 1, step: 0.1 } },
      { type: FormEnum.INPUT_NUMBER, model: 'opacity', propsData: { min: 0, max: 1, step: 0.1 } },
    ],
  },
]);

const schema = computed<Array<SchemaItem>>(() => [
  {
    title: t('borderAndRadius'),
    fields: [
      {
        label: t('radius'),
        item: {
          type: FormEnum.INPUT_NUMBER,
          model: 'borderRadius',
        },
      },
      {
        label: t('border'),
        extra: [t('width'), t('borderStyle')],
        item: [
          {
            type: FormEnum.INPUT_NUMBER,
            model: 'borderWidth',
          },
          {
            type: FormEnum.SELECT,
            model: 'borderStyle',
            data: [
              { id: 'none', label: t('none') },
              { id: 'dotted', label: t('dotted') },
              { id: 'dashed', label: t('dashed') },
              { id: 'solid', label: t('solid') },
            ],
          },
        ],
      },
    ],
  },
  {
    title: t('font'),
    fields: [
      {
        label: t('font'),
        extra: [t('width'), t('weight')],
        item: [
          { model: 'fontSize', type: FormEnum.INPUT_NUMBER, default: 14 },
          {
            model: 'fontWeight',
            type: FormEnum.SELECT,
            data: [
              { id: 'normal', label: t('normal') },
              { id: 'lighter', label: t('lighter') },
              { id: 'bold', label: t('bold') },
            ],
          },
        ],
      },
      {
        label: t('text'),
        extra: [t('lineHeight'), t('letterSpacing')],
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
        label: t('textAlign'),
        item: {
          model: 'textAlign',
          type: FormEnum.BTN_GROUP,
          data: [
            { icon: AlignLeftOutlined, tip: t('left'), value: 'left' },
            { icon: AlignCenterOutlined, tip: t('center'), value: 'center' },
            { icon: AlignRightOutlined, tip: t('right'), value: 'right' },
          ],
        },
      },
    ],
  },
  {
    title: t('color'),
    fields: [
      {
        label: t('fontColor'),
        item: { model: 'color', type: FormEnum.COLOR_PICKER },
      },
      {
        label: t('background'),
        item: { model: 'backgroundColor', type: FormEnum.COLOR_PICKER },
      },
      {
        label: t('borderColor'),
        item: { type: FormEnum.COLOR_PICKER, model: 'borderColor' },
      },
    ],
  },
]);

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
    schema.value.forEach(val => {
      val.fields.forEach(field => {
        const { item } = field;
        setDefaultVal(item, style as unknown as Data<string | number>);
      });
    });
  }
});

watchEffect(() => {
  if (!board.curCom) return;
  const { component, propsData } = board.curCom;
  cloneGallery.value = gallery.getGallery(component);
  if (!cloneGallery.value) return;
  const { attr } = cloneGallery.value;
  if (board.selected.length === 1 && attr && propsData) {
    attr.forEach(item => {
      item.fields.forEach(field => {
        setDefaultVal(field.item, propsData);
      });
    });
  }
});
</script>

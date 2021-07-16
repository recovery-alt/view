<template>
  <FormItem :label="field.label">
    <Row>
      <template v-if="Array.isArray(field.item)">
        <Col
          v-for="(formItem, i) in field.item"
          :key="formItem.model"
          :span="formItem.span || 10"
          :offset="multiOffset(formItem, i)"
        >
          <FormGenerator :field="formItem" :model="model" />
        </Col>
      </template>
      <Col v-else :span="singleSpan(field.item)" :offset="field.item.offset">
        <FormGenerator :field="field.item" :model="model" />
      </Col>
    </Row>
    <template v-if="field.extra" #extra>
      <div class="form-item__extra">
        <span v-for="extra in field.extra" :key="extra">{{ extra }}</span>
      </div>
    </template>
  </FormItem>
</template>

<script lang="ts" setup>
import type { FieldItem, Field } from '@/typings';
import type { PropType } from 'vue';
import { FormEnum } from '@/enum';
import FormGenerator from './form-generator.vue';
import { FormItem, Row, Col } from 'ant-design-vue';

defineProps({
  field: {
    type: Object as PropType<Field>,
    default: () => ({}),
  },
  model: {
    type: Object,
    default: () => ({}),
  },
});

const singleSpan = (item: FieldItem) => {
  if (item.span) return item.span;
  return item.type === FormEnum.INPUT_NUMBER ? 10 : 16;
};

const multiOffset = (item: FieldItem, i: number) => {
  if (item.offset) return item.offset;
  return i > 0 ? 2 : 0;
};
</script>

<style lang="less">
.form-item {
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

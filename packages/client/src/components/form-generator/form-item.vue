<template>
  <a-form-item :label="field.label">
    <a-row>
      <template v-if="Array.isArray(field.item)">
        <a-col
          v-for="(formItem, i) in field.item"
          :key="formItem.model"
          :span="formItem.span || 10"
          :offset="multiOffset(formItem, i)"
        >
          <form-generator :field="formItem" :model="model" />
        </a-col>
      </template>
      <a-col v-else :span="singleSpan(field.item)" :offset="field.item.offset">
        <form-generator :field="field.item" :model="model" />
      </a-col>
    </a-row>
    <template v-if="field.extra" #extra>
      <div class="form-item__extra">
        <span v-for="extra in field.extra" :key="extra">{{ extra }}</span>
      </div>
    </template>
  </a-form-item>
</template>

<script lang="ts" setup>
import type { FieldItem } from '@/typings';
import { defineProps } from 'vue';
import { FormEnum } from '@/enum';
import FormGenerator from './form-generator.vue';

defineProps({
  field: {
    type: Object,
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

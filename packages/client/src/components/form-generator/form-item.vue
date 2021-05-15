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
          <form-element :field="formItem" :model="model" />
        </a-col>
      </template>
      <a-col v-else :span="singleSpan(field.item)" :offset="field.item.offset">
        <form-element :field="field.item" :model="model" />
      </a-col>
    </a-row>
    <template v-if="field.extra" #extra>
      <div class="attr-panel__extra">
        <span v-for="extra in field.extra" :key="extra">{{ extra }}</span>
      </div>
    </template>
  </a-form-item>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { FormEnum } from '@/enum';
import FormElement from './form-element.vue';

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

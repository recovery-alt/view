<template>
  <a-collapse v-model:activeKey="activeKey" expand-icon-position="right" size="small">
    <a-collapse-panel
      v-for="item in schema"
      :key="item.title"
      :title="item.title"
      :header="item.title"
    >
      <form-item v-for="field in item.fields" :key="field.label" :field="field" :model="model" />
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { defineProps } from 'vue';
import FormItem from './form-item.vue';

defineProps({
  schema: {
    type: Array as PropType<Array<SchemaItem>>,
    default: () => ({}),
  },
  model: {
    type: Object as PropType<Data<string | number>>,
    default: () => ({}),
  },
  activeKey: {
    type: String,
    default: () => '',
  },
});
</script>

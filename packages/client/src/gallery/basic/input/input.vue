<template>
  <a-input v-model:value="propsData.value" size="small" />
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { defineProps } from 'vue';
import { Input as AInput } from 'ant-design-vue';
import 'ant-design-vue/lib/input/style/index.css';

defineProps({
  propsData: {
    type: Object as PropType<{ value: string }>,
    default: () => ({ value: '' }),
  },
});
</script>

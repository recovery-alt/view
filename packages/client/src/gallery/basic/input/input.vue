<template>
  <Input v-model:value="propsData.value" size="small"></Input>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { defineProps } from 'vue';
import { Input } from 'ant-design-vue';
import 'ant-design-vue/lib/input/style/index.css';

defineProps({
  propsData: {
    type: Object as PropType<{ value: string }>,
    default: () => ({ value: '' }),
  },
});
</script>

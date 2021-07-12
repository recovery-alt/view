<template>
  <input v-model="propsData.value" />
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
  propsData: {
    type: Object as PropType<{ value: string }>,
    default: () => ({ value: '' }),
  },
});
</script>

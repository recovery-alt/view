<template>
  <h2 class="headline">{{ propsData.value }}</h2>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({ propsData: { type: Object as PropType<{ value: string }>, default: () => '' } });
</script>

<style lang="less" scoped>
.headline {
  margin-bottom: 0;
}
</style>

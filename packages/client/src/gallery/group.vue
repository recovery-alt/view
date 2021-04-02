<template>
  <div class="board-group">
    <component
      :is="item.component"
      v-for="item in group"
      :key="item.id"
      :style="patchUnit(item.style)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { defineProps } from 'vue';
import { patchUnit } from '@/utils';

defineProps({ group: { type: Array as PropType<Array<Component>>, default: () => [] } });
</script>

<style lang="less" scoped>
.board-group {
  position: absolute;
  height: 100%;

  & > * {
    position: absolute;
  }
}
</style>

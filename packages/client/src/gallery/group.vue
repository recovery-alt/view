<template>
  <div class="board-group">
    <board-box v-for="item in group" :key="item.id" :data="item" patch-all />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { defineProps } from 'vue';
import { BoardBox } from '@/components';

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

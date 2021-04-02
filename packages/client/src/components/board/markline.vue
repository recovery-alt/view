<template>
  <div
    v-for="line in markline.lines"
    v-show="line.show"
    :key="line.name"
    class="board-markline"
    :class="line.name.includes('x') ? 'xline' : 'yline'"
    :style="patchUnit(line.style)"
  />
</template>

<script lang="ts" setup>
import { markline } from '@/hooks';
import { patchUnit } from '@/utils';
</script>

<style lang="less">
.board-markline {
  position: absolute;
  background-color: var(--primary-color);
  z-index: 1000;

  &.xline {
    width: 100%;
    height: 1px;
  }

  &.yline {
    width: 1px;
    height: 100%;
  }
}
</style>

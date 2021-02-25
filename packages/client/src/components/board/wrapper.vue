<template>
  <div v-for="item in data" :key="item.id" class="board-wrapper" :style="patchUnit(item.style)">
    <component :is="item.component" />
  </div>
</template>

<script lang="ts">
import { patchUnit } from '@/utils';

export default {
  name: 'board-wrapper',
  props: {
    data: { type: Array, default: () => [] },
  },
  setup(props) {
    return { patchUnit };
  },
};
</script>

<style lang="scss" scoped>
.board-wrapper {
  position: absolute;
}
</style>

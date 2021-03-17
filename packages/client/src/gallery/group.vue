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

<script lang="ts">
import { PropType } from 'vue';
import { patchUnit } from '@/utils';

export default {
  name: 'group',
  props: {
    group: {
      type: Array as PropType<Array<Component>>,
      default: () => [],
    },
  },
  setup() {
    return { patchUnit };
  },
};
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

<template>
  <div class="data-panel"></div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();
    const { board } = store.state;

    const curComponent = computed(() => {
      return board.data[board.selected[0]];
    });

    return { curComponent };
  },
};
</script>

<style lang="less">
.data-panel {
  background-color: var(--body-background);
}
</style>

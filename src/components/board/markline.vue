<template>
  <div
    class="board-markline"
    v-for="line in markline.lines"
    v-show="line.show"
    :key="line.name"
    :class="line.name.includes('x') ? 'xline' : 'yline'"
    :style="line.style"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { markline } from '@/hooks';

const name = 'board-markline';

const setup = () => {
  return { markline };
};

export default defineComponent({ name, setup });
</script>

<style lang="scss" scoped>
.board-markline {
  position: absolute;
  background-color: #59c7f9;
  z-index: 1000;
}

.xline {
  width: 100%;
  height: 1px;
}

.yline {
  width: 1px;
  height: 100%;
}
</style>

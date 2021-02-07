<template>
  <div
    v-for="line in markline.lines"
    v-show="line.show"
    class="board-markline"
    :key="line.name"
    :class="line.name.includes('x') ? 'xline' : 'yline'"
    :style="patchUnit(line.style)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { markline } from '@/hooks';
import { patchUnit } from '@/utils';

const name = 'board-markline';

const setup = () => {
  return { markline, patchUnit };
};

export default defineComponent({ name, setup });
</script>

<style lang="scss" scoped>
.board-markline {
  position: absolute;
  background-color: $el-primary-1;
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

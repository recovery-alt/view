<template>
  <div class="board" @drop="handleDrop" @dragover="handleDragOver" @click="cancelSelected">
    <shape
      v-for="(item, index) in board.data"
      :key="item.id"
      :active="board.index === index"
      :index="index"
      v-bind="item.position"
    >
      <component :is="item.component" :style="item.style" />
    </shape>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useBoard, useDragEvent } from '@/hooks';
import Shape from '@/components/shape';

const components = { Shape };

const setup = () => {
  const { board, append, cancelSelected } = useBoard();
  const { handleDrop, handleDragOver } = useDragEvent(append);

  return { board, cancelSelected, handleDragOver, handleDrop };
};

export default defineComponent({ components, setup });
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  background-color: #fff;
  overflow: auto;
}
</style>

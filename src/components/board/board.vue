<template>
  <div
    class="board"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @click="handleLeftClick"
    @contextmenu="handleRightClick"
  >
    <board-shape
      v-for="(item, index) in board.data"
      :key="item.id"
      :active="board.index === index"
      :index="index"
      :style="patchUnit(item.style)"
    >
      <component :is="item.component" />
    </board-shape>
    <board-menu v-show="menu.show" :style="patchUnit(menu.style)" />
    <board-markline />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BoardMenu from './menu.vue';
import BoardShape from './shape.vue';
import BoardMarkline from './markline.vue';
import { useStore } from '@/store';
import { BoardEnum } from '@/store/modules/board';
import { menu, showMenu, hideMenu } from '@/hooks';
import { patchUnit } from '@/utils';

const name = 'board';

const components = { BoardShape, BoardMenu, BoardMarkline };

const setup = () => {
  const store = useStore();
  const { board } = store.state;

  const handleLeftClick = () => {
    store.dispatch(BoardEnum.CANCEL_SELECTED);
    hideMenu();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer?.getData('type');
    if (!type) return;
    const { offsetX: left, offsetY: top } = e;
    store.dispatch(BoardEnum.APEEND, { type, left, top });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    showMenu(e);
  };

  return { board, handleLeftClick, handleDragOver, handleDrop, handleRightClick, menu, patchUnit };
};

export default defineComponent({ name, components, setup });
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  background-color: $el-white;
  overflow: auto;
}
</style>

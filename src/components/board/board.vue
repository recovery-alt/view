<template>
  <div
    class="board"
    @drop="handleDrop"
    @dragover.prevent
    @mousedown="handleMousedown"
    @mouseup="handleMouseup"
    @contextmenu="handleRightClick"
  >
    <board-shape
      v-for="(item, index) in board.data"
      :key="item.id"
      :active="board.selected.includes(index)"
      :index="index"
      :zIndex="index"
      :style="patchUnit(item.style)"
    >
      <component :is="item.component" />
    </board-shape>
    <board-menu v-model="menu.show" v-show="menu.show" :style="patchUnit(menu.style)" />
    <board-markline />
    <div class="board-mask" v-show="selectMask.show" :style="patchUnit(selectMask.style)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import BoardMenu from './menu.vue';
import BoardShape from './shape.vue';
import BoardMarkline from './markline.vue';
import { useStore } from '@/store';
import { BoardEnum } from '@/store/modules/board';
import { menu, showMenu, hideMenu } from '@/hooks';
import { patchUnit, on, getBoardReletedPosition, off } from '@/utils';
import { useSelectMask } from '@/hooks';

const name = 'board';

const components = { BoardShape, BoardMenu, BoardMarkline };

const setup = () => {
  const store = useStore();
  const { board } = store.state;
  const { selectMask, handleMousedown } = useSelectMask(store);

  const handleMouseup = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList && [...target.classList].includes('shape')) return;
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

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    showMenu(e);
  };

  return {
    board,
    handleMouseup,
    handleMousedown,
    handleDrop,
    handleRightClick,
    menu,
    patchUnit,
    selectMask,
  };
};

export default defineComponent({ name, components, setup });
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  background-color: $el-white;
  overflow: auto;

  &-mask {
    position: absolute;
    opacity: 0.5;
    background-color: $el-primary-8;
    border: 1px solid $el-primary-1;
  }
}
</style>

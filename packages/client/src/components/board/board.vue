<template>
  <div
    class="board"
    @drop="handleDrop"
    @dragover.prevent
    @mousedown="handleMousedown"
    @contextmenu="handleRightClick"
  >
    <board-grid />
    <board-shape
      v-for="(item, index) in board.data"
      :key="item.id"
      :active="board.selected.includes(index)"
      :index="index"
      :z-index="index"
      :style="patchUnit(item.style)"
    >
      <component
        :is="item.component"
        :key="item.id"
        :ref="el => el && setBoardRef(el.$el, index)"
        :index="index"
      />
    </board-shape>
    <board-menu v-show="menu.show" v-model="menu.show" :style="patchUnit(menu.style)" />
    <board-markline />
    <div v-show="selectMask.show" class="board-mask" :style="patchUnit(selectMask.style)" />
  </div>
</template>

<script lang="ts">
import BoardMenu from './menu.vue';
import BoardShape from './shape.vue';
import BoardMarkline from './markline.vue';
import BoardGrid from './grid.vue';
import { useStore } from '@/store';
import { BoardEnum } from '@/store/modules/board';
import { menu, showMenu } from '@/hooks';
import { patchUnit } from '@/utils';
import { useSelectMask, useBoardRefs } from '@/hooks';

export default {
  name: 'board',
  components: { BoardShape, BoardMenu, BoardMarkline, BoardGrid },
  setup() {
    const store = useStore();
    const { board } = store.state;
    const { selectMask, handleMousedown } = useSelectMask(store);

    const { setBoardRef } = useBoardRefs();

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
      handleMousedown,
      handleDrop,
      handleRightClick,
      menu,
      patchUnit,
      selectMask,
      setBoardRef,
    };
  },
};
</script>

<style lang="less" scoped>
.board {
  position: relative;
  background-color: @white;
  overflow: auto;

  &-mask {
    position: absolute;
    opacity: 0.5;
    background-color: @primary-1;
    border: 1px solid @primary-8;
  }
}
</style>

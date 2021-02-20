<template>
  <div
    class="board"
    @drop="handleDrop"
    @dragover.prevent
    @mousedown="handleMousedown"
    @click="handleLeftClick"
    @contextmenu="handleRightClick"
  >
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
import { useStore } from '@/store';
import { BoardEnum } from '@/store/modules/board';
import { menu, showMenu, hideMenu } from '@/hooks';
import { patchUnit } from '@/utils';
import { useSelectMask, useBoardRefs } from '@/hooks';

export default {
  name: 'board',
  components: { BoardShape, BoardMenu, BoardMarkline },
  setup() {
    const store = useStore();
    const { board } = store.state;
    const { selectMask, handleMousedown } = useSelectMask(store);

    const { setBoardRef } = useBoardRefs();

    const handleLeftClick = () => {
      if (!selectMask.mousemoved) {
        store.dispatch(BoardEnum.CANCEL_SELECTED);
        hideMenu();
      }
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
      handleLeftClick,
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

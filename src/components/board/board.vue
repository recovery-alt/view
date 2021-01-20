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
      v-bind="item.position"
      :style="item.style"
    >
      <component :is="item.component" />
    </board-shape>
    <board-menu v-if="menu.show" :style="menu.style" v-bind="menu.position" />
    <board-markline />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Events, ref, toRefs } from 'vue';
import BoardMenu from './menu.vue';
import BoardShape from './shape.vue';
import BoardMarkline from './markline.vue';
import { useStore } from 'vuex';
import { BoardEnum } from '@/store/modules/board';
import { menu, showMenu, hideMenu, setPosition } from '@/hooks';
import { EventEmitter } from 'element-plus/lib/utils/types';
import { defaultStyleOption } from '@/options';

const name = 'board';

const components = { BoardShape, BoardMenu, BoardMarkline };

const setup = () => {
  const store = useStore();

  const board = store.getters[BoardEnum.GET_BOARD];

  const append = (component: Component) => store.dispatch(BoardEnum.APEEND, component);

  const handleLeftClick = (e: MouseEvent) => {
    store.commit(BoardEnum.CANCEL_SELECTED);
    hideMenu();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer?.getData('type');
    const offsetX = e.dataTransfer?.getData('offsetX');
    const offsetY = e.dataTransfer?.getData('offsetY');
    if (type && typeof offsetX !== undefined && typeof offsetY !== undefined) {
      const top = e.offsetY;
      const left = e.offsetX;
      const position = { top, left, ...defaultStyleOption } as Pos;
      append({ component: `v-${type}`, position, style: {} });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    showMenu(e);
  };

  return { board, handleLeftClick, handleDragOver, handleDrop, handleRightClick, menu };
};

export default defineComponent({ name, components, setup });
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  background-color: #fff;
  overflow: auto;
}
</style>

<template>
  <div
    class="board"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @click="cancelSelected"
    @contextmenu="handleRightClick"
  >
    <shape
      v-for="(item, index) in board.data"
      :key="item.id"
      :active="board.index === index"
      :index="index"
      v-bind="item.position"
    >
      <component :is="item.component" :style="item.style" />
    </shape>
    <board-menu v-if="menu.show" :style="menu.style" v-bind="menu.position" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Events, ref, toRefs } from 'vue';
import Shape from '@/components/shape';
import { useStore } from 'vuex';
import { BoardEnum } from '@/store/modules/board';
import BoardMenu from '@/components/board-menu';
import { useMenu } from '@/hooks';
import { EventEmitter } from 'element-plus/lib/utils/types';

const components = { Shape, BoardMenu };

const setup = () => {
  const store = useStore();

  const board = computed(() => store.state.board);

  const { menu, showMenu, hideMenu, setPosition } = useMenu();

  const append = (component: Component) => store.dispatch(BoardEnum.APEEND, component);
  const cancelSelected = () => store.commit(BoardEnum.CANCEL_SELECTED);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer?.getData('type');
    const offsetX = e.dataTransfer?.getData('offsetX');
    const offsetY = e.dataTransfer?.getData('offsetY');
    if (type && typeof offsetX !== undefined && typeof offsetY !== undefined) {
      const top = e.offsetY;
      const left = e.offsetX;
      append({ component: `v-${type}`, position: { top, left }, style: {} });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleRightClick = (e: any) => {
    e.preventDefault();
    const { layerX, layerY } = e;
    setPosition({ left: layerX as number, top: layerY as number });
    showMenu();
  };

  return { board, cancelSelected, handleDragOver, handleDrop, handleRightClick, menu };
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

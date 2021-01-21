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
import { useStore } from '@/store';
import { BoardEnum } from '@/store/modules/board';
import { menu, showMenu, hideMenu, setPosition } from '@/hooks';
import { EventEmitter } from 'element-plus/lib/utils/types';
import { defaultComponentSize, presetComponentAttr } from '@/options';

const name = 'board';

const components = { BoardShape, BoardMenu, BoardMarkline };

const setup = () => {
  const store = useStore();
  const { board } = store.state;

  const append = (component: Component) => store.dispatch(BoardEnum.APEEND, component);

  const handleLeftClick = (e: MouseEvent) => {
    store.commit(BoardEnum.CANCEL_SELECTED);
    hideMenu();
  };

  const newComponent = (type: string, left: number, top: number) => {
    const position = { top, left, ...defaultComponentSize };
    const component = `v-${type}`;
    const attr = presetComponentAttr;
    append({ component, attr, position, style: {} });
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer?.getData('type');
    if (!type) return;
    const { offsetX, offsetY } = e;
    newComponent(type, offsetX, offsetY);
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
  background-color: $el-white;
  overflow: auto;
}
</style>

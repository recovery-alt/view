<template>
  <div ref="canvasWrapperRef" class="canvas-wrapper" @scroll="handleScroll">
    <div ref="screenShotRef" class="screen-shot" style="width: 2320px; height: 1480px">
      <div class="fixed-wrapper">
        <div class="ruler-wrapper --x" :style="`transform: translateX(${position.left}px)`">
          <board-ruler width="4640" height="40" style="width: 2320px; height: 20px" />
        </div>
        <div
          class="ruler-wrapper --y"
          :style="`transform: rotate(90deg) translateX(${position.top}px)`"
        >
          <board-ruler width="2960" height="40" style="width: 1480px; height: 20px" />
        </div>
        <div class="guide-line__controller">
          <EyeInvisibleOutlined />
        </div>
      </div>

      <div
        class="board"
        :style="patchUnit(pageStyle)"
        @drop="handleDrop"
        @dragover.prevent
        @mousedown="handleMousedown"
        @contextmenu="handleRightClick"
      >
        <!-- <board-grid /> -->
        <board-shape
          v-for="(item, index) in board.data"
          :key="item.id"
          :active="board.selected.includes(index)"
          :index="index"
          :z-index="index"
          :style="splitStyleAndPatch(item.style)"
        >
          <component
            :is="item.component"
            :key="item.id"
            :ref="el => el && setBoardRef(el.$el, index)"
            :index="index"
            :style="splitStyleAndPatch(item.style, false)"
          />
        </board-shape>

        <board-menu v-show="menu.show" v-model="menu.show" :style="patchUnit(menu.style)" />
        <board-markline />
        <div v-show="selectMask.show" class="board-mask" :style="patchUnit(selectMask.style)" />
      </div>
    </div>
  </div>

  <section class="thumbnail">
    <canvas ref="thumbnailRef" class="thumbnail__canvas" width="380" height="220" />
    <span :style="patchUnit(viewportSize)" @mousedown.stop="handleThumbnailMousedown"></span>
  </section>

  <footer class="edit-slider">
    <a-slider size="small" />
  </footer>
</template>

<script lang="ts">
import BoardMenu from './menu.vue';
import BoardShape from './shape.vue';
import BoardMarkline from './markline.vue';
import BoardGrid from './grid.vue';
import BoardRuler from './ruler.vue';
import { BoardEnum, useStore } from '@/store';
import { menu, showMenu, pageConfig, useSelectMask, useBoardRefs, useThumbnail } from '@/hooks';
import { patchUnit, splitStyleAndPatch } from '@/utils';
import { EyeInvisibleOutlined } from '@ant-design/icons-vue';
import { computed, reactive, ref } from 'vue';

export default {
  name: 'board',
  components: { BoardShape, BoardMenu, BoardMarkline, BoardGrid, BoardRuler, EyeInvisibleOutlined },
  setup() {
    const store = useStore();
    const { board } = store.state;
    const { selectMask, handleMousedown } = useSelectMask(store);
    const position = reactive({ left: 0, top: 0 });
    const { setBoardRef } = useBoardRefs();
    const screenShotRef = ref<HTMLElement | null>(null);
    const canvasWrapperRef = ref<HTMLElement | null>(null);

    const pageStyle = computed(() => {
      const { width, height, backgroundColor } = pageConfig;
      return { width, height, backgroundColor };
    });

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

    const {
      viewportSize,
      resizeViewport,
      thumbnailRef,
      handleThumbnailMousedown,
      syncScroll,
    } = useThumbnail(screenShotRef, canvasWrapperRef);

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      window.requestAnimationFrame(() => {
        const { scrollLeft, scrollTop } = target;
        position.left = -scrollLeft;
        position.top = -scrollTop;
        syncScroll();
      });
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
      pageStyle,
      handleScroll,
      position,
      splitStyleAndPatch,
      viewportSize,
      resizeViewport,
      thumbnailRef,
      handleThumbnailMousedown,
      screenShotRef,
      canvasWrapperRef,
    };
  },
};
</script>

<style lang="less">
.board {
  position: absolute;
  background-color: var(--component-background);
  top: 60px;
  left: 60px;

  &-mask {
    position: absolute;
    opacity: 0.5;
    background-color: var(--primary-1);
    border: 1px solid var(--border-color-base);
  }
}

.canvas-wrapper {
  overflow: auto;
  position: relative;
  width: 100%;
  height: 100%;
}

.ruler-wrapper {
  position: absolute;
  height: 20px;

  &.--x {
    cursor: ew-resize;
    left: 20px;
  }

  &.--y {
    cursor: ns-resize;
    transform-origin: 0 100% 0;
    transform: rotate(90deg);
  }
}

.guide-line {
  &__controller {
    border-right: 1px solid var(--black);
    border-bottom: 1px solid var(--black);
    width: 20px;
    height: 20px;
    font-size: 14px;
    cursor: pointer;
    position: fixed;
    z-index: 999;
    align-items: center;
    justify-content: center;
    display: flex;
    background-color: var(--component-background);
  }
}

.edit-slider {
  background: var(--normal-color);
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: 40px;
  user-select: none;
  z-index: 99;
}

.fixed-wrapper {
  position: fixed;
  z-index: 1;
}

.thumbnail {
  position: absolute;
  right: 5px;
  bottom: 70px;
  user-select: none;
  transition: 0.3s transform var(--ease-in-out);

  &__canvas {
    width: 190px;
    height: 110px;
    background-color: rgba(0, 0, 0, 0.3);
  }

  span {
    position: absolute;
    border: 1px solid var(--primary-1);
    z-index: 2;
    top: 0;
    left: 0;
    cursor: move;
    width: 64px;
    height: 48px;
  }
}
</style>

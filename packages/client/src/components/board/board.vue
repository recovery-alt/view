<template>
  <div ref="canvasWrapperRef" class="canvas-wrapper" @scroll="handleScroll">
    <div ref="screenShotRef" class="screen-shot" :style="patchUnit(screenShotSize)">
      <div class="fixed-wrapper">
        <div class="ruler-wrapper --x" :style="`transform: translateX(${position.left}px)`">
          <board-ruler
            :key="rulerKey"
            :scale="pageConfig.scale"
            :width="screenShotSize.width * 2 + ''"
            :style="{ width: screenShotSize.width + 'px' }"
          />
        </div>
        <div
          class="ruler-wrapper --y"
          :style="`transform: rotate(90deg) translateX(${position.top}px)`"
        >
          <board-ruler
            :key="rulerKey"
            :scale="pageConfig.scale"
            :width="screenShotSize.height * 2 + ''"
            :style="{ width: screenShotSize.height + 'px' }"
          />
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
        <div v-show="selectMask.show" class="board__mask" :style="patchUnit(selectMask.style)" />
      </div>
    </div>
  </div>

  <section class="thumbnail">
    <canvas ref="thumbnailRef" class="thumbnail__canvas" width="380" height="220" />
    <span :style="patchUnit(viewportSize)" @mousedown.stop="handleThumbnailMousedown"></span>
  </section>

  <footer class="edit-slider">
    <a-col span="2">
      <a-input-number
        v-model:value="pageConfig.scale"
        size="small"
        :min="20"
        :max="200"
        :formatter="sliderFormatter"
      />
    </a-col>
    <a-col span="4" class="edit-slider__col">
      <a-slider
        v-model:value="pageConfig.scale"
        size="small"
        :min="20"
        :max="200"
        :tip-formatter="sliderFormatter"
        @change="handleSliderChange"
      />
    </a-col>
    <a-col span="1" class="edit-slider__col">
      <BlockOutlined class="edit-slider__icon" />
    </a-col>
  </footer>
</template>

<script lang="ts">
import { BoardMenu, BoardShape, BoardMarkline, BoardRuler } from '@/components';
import { BoardEnum, useStore } from '@/store';
import {
  menu,
  showMenu,
  pageConfig,
  useSelectMask,
  useBoardRefs,
  useThumbnail,
  useEditSlider,
} from '@/hooks';
import { patchUnit, splitStyleAndPatch } from '@/utils';
import { EyeInvisibleOutlined, BlockOutlined } from '@ant-design/icons-vue';
import { computed, reactive, ref } from 'vue';

export default {
  name: 'board',
  components: {
    BoardShape,
    BoardMenu,
    BoardMarkline,
    BoardRuler,
    EyeInvisibleOutlined,
    BlockOutlined,
  },
  setup() {
    const store = useStore();
    const { board } = store.state;
    const { selectMask, handleMousedown } = useSelectMask(store);
    const position = reactive({ left: 0, top: 0 });
    const { setBoardRef } = useBoardRefs();
    const screenShotRef = ref<HTMLElement | null>(null);
    const canvasWrapperRef = ref<HTMLElement | null>(null);

    const pageStyle = computed(() => {
      const { width, height, backgroundColor, scale } = pageConfig;
      return { width, height, backgroundColor, scale };
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

    const { sliderFormatter, handleSliderChange, screenShotSize, rulerKey } = useEditSlider(
      canvasWrapperRef
    );

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
      pageConfig,
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
      sliderFormatter,
      handleSliderChange,
      screenShotSize,
      rulerKey,
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
  transform-origin: 0 0;
  transition: 0.2s all var(--ease-in-out);
  background-size: cover, contain;
  background-position: center, right bottom;
  background-repeat: no-repeat, no-repeat;
  box-shadow: var(--box-shadow-base);

  &__mask {
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
  position: absolute;
  right: 0;
  bottom: 40px;
  background: var(--normal-color);
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 99;

  .ant-input-number {
    width: auto;
  }

  &__col {
    margin-left: 10px;
    font-size: 16px;
  }

  &__icon {
    cursor: pointer;

    &:hover {
      color: var(--primary-color);
    }
  }
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

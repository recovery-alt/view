<template>
  <div ref="canvasWrapperRef" class="canvas-wrapper" @scroll="handleScroll">
    <div ref="screenShotRef" class="screen-shot" :style="patchUnit(screenShotSize)">
      <div class="fixed-wrapper">
        <div
          v-for="item in rulerData"
          :key="item.direction"
          :class="`ruler-wrapper --${item.direction}`"
          :style="getStyle(item.direction, position)"
        >
          <board-ruler
            :key="rulerKey"
            :scale="pageConfig.scale"
            :width="screenShotSize[getUnit(item.direction)] * 2 + ''"
            :style="{ width: screenShotSize[getUnit(item.direction)] + 'px' }"
            @click="addMarkline($event, item.marklineDct)"
          />
          <div
            v-for="(markline, i) in item.marklines"
            :key="markline"
            :class="`markline --${item.marklineDct}`"
            :style="{ left: markline + 'px' }"
            @contextmenu.prevent="cancelMarkline(i, item.direction)"
          >
            <span>{{ markline - 40 }}</span>
          </div>
        </div>
        <div class="guide-line__controller">
          <EyeInvisibleOutlined />
        </div>
      </div>

      <div
        ref="boardDom"
        class="board"
        :style="patchUnit(pageStyle)"
        @drop="handleDrop"
        @dragover.prevent
        @mousedown="handleMousedown"
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
            :group="item.group"
            :style="splitStyleAndPatch(item.style, false)"
          />
        </board-shape>

        <board-menu v-if="menu.board.show" menu-type="board" :container="$refs.boardDom" />
        <board-markline />
        <div v-show="selectMask.show" class="board__mask" :style="patchUnit(selectMask.style)" />
      </div>
    </div>
  </div>

  <section v-show="showThumbnail" class="thumbnail">
    <canvas ref="thumbnailRef" class="thumbnail__canvas" width="380" height="220" />
    <span :style="patchUnit(viewportSize)" @mousedown.stop="handleThumbnailMousedown"></span>
  </section>

  <footer class="edit-slider">
    <a-col span="1">
      <a-tooltip>
        <template #title>
          <div key="1" class="edit-slider__text">
            <span>切换图层面板</span><span>ctrl/cmd + &larr;</span>
          </div>
          <div key="2" class="edit-slider__text">
            <span>切换组件面板</span><span>ctrl/cmd + &uarr;</span>
          </div>
          <div key="3" class="edit-slider__text">
            <span>切换右侧面板</span><span>ctrl/cmd + &rarr;</span>
          </div>
        </template>
        <MacCommandOutlined class="edit-slider__icon" />
      </a-tooltip>
    </a-col>
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
      <BlockOutlined class="edit-slider__icon" @click="switchThumbnail" />
    </a-col>
  </footer>
</template>

<script lang="ts">
import { BoardMenu, BoardShape, BoardMarkline, BoardRuler } from '@/components';
import { BoardEnum, useStore } from '@/store';
import {
  menu,
  pageConfig,
  useSelectMask,
  useBoardRefs,
  useThumbnail,
  useEditSlider,
  useRuler,
} from '@/hooks';
import { patchUnit, splitStyleAndPatch } from '@/utils';
import { EyeInvisibleOutlined, BlockOutlined, MacCommandOutlined } from '@ant-design/icons-vue';
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
    MacCommandOutlined,
  },
  setup() {
    const store = useStore();
    const { board } = store.state;
    const { selectMask, handleMousedown } = useSelectMask(store);
    const position = reactive({ left: 0, top: 0 });
    const { setBoardRef } = useBoardRefs();
    const screenShotRef = ref<HTMLElement | null>(null);
    const canvasWrapperRef = ref<HTMLElement | null>(null);
    const boardDom = ref<HTMLElement | null>(null);

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

    const { sliderFormatter, handleSliderChange, screenShotSize, rulerKey } = useEditSlider(
      canvasWrapperRef
    );

    const {
      viewportSize,
      resizeViewport,
      thumbnailRef,
      handleThumbnailMousedown,
      syncScroll,
      showThumbnail,
      switchThumbnail,
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

    const { rulerData, getStyle, getUnit, addMarkline, cancelMarkline } = useRuler();

    return {
      board,
      boardDom,
      handleMousedown,
      handleDrop,
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
      showThumbnail,
      switchThumbnail,
      screenShotRef,
      canvasWrapperRef,
      sliderFormatter,
      handleSliderChange,
      screenShotSize,
      rulerKey,
      rulerData,
      getStyle,
      getUnit,
      addMarkline,
      cancelMarkline,
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

  &__text {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span:last-child {
      margin-left: 20px;
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

.markline {
  position: absolute;
  background-color: var(--primary-color);

  width: 1px;

  &.--x {
    top: 20px;
    height: 100vw;
    transform: translateY(-100%);
    span {
      bottom: 15px;
    }
  }

  &.--y {
    top: 0;
    height: 100vh;
    span {
      top: 15px;
    }
  }

  span {
    position: absolute;
    left: 5px;
    background-color: var(--primary-color);
    color: var(--white);
    padding: 0 3px;
  }
}
</style>

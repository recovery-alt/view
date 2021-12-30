<template>
  <div ref="canvasWrapperRef" tabindex="-1" class="canvas-wrapper" @scroll="handleScroll">
    <div ref="screenShotRef" class="screen-shot" :style="patchUnit(screenShotSize)">
      <div class="fixed-wrapper">
        <div
          v-for="item in rulerData"
          :key="item.direction"
          :class="`ruler-wrapper --${item.direction}`"
          :style="getStyle(item.direction, position)"
        >
          <BoardRuler
            :key="rulerKey"
            :width="screenShotSize[getUnit(item.direction)] * 2"
            :style="{ width: screenShotSize[getUnit(item.direction)] + 'px' }"
            @click="addMarkline($event, item.marklineDct)"
            @mousemove="handleRulerMouseMove($event, item.marklineDct)"
            @mouseout="handleRulerMouseOut(item.marklineDct)"
          />
          <template v-if="showMarkline">
            <div
              v-for="(markline, i) in item.marklines"
              :key="markline"
              :class="`markline --${item.marklineDct}`"
              :style="{ left: markline + 'px' }"
              @contextmenu.prevent="cancelMarkline(i, item.direction)"
            >
              <span>{{ Math.floor(markline) - 40 }}</span>
            </div>
          </template>
          <div
            v-if="item.hoverline"
            :class="['markline', `--${item.marklineDct}`, '--dashed']"
            :style="{ left: item.hoverline + 'px' }"
          >
            <span>{{ Math.floor(item.hoverline) - 40 }}</span>
          </div>
        </div>
        <div class="guide-line__controller">
          <EyeInvisibleOutlined v-if="showMarkline" @click="switchMarklineDisplay" />
          <EyeOutlined v-else @click="switchMarklineDisplay" />
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
        <BoardShape
          v-for="(item, index) in board.data"
          :key="item.id"
          tabindex="0"
          :active="board.selected.includes(index)"
          :index="index"
          :z-index="index"
          :style="splitStyleAndPatch(item.style)"
        >
          <BoardBox
            :ref="(el: any) => el && board.pushRef(el.$el)"
            class="board__component"
            :data="item"
            editor-mode
          />
        </BoardShape>

        <div v-show="selectMask.show" class="board__mask" :style="patchUnit(selectMask.style)" />
      </div>
    </div>
  </div>

  <section v-show="showThumbnail" class="thumbnail">
    <canvas ref="thumbnailRef" class="thumbnail__canvas" width="380" height="220" />
    <span :style="patchUnit(viewportSize)" @mousedown.stop="handleThumbnailMousedown"></span>
  </section>

  <footer class="edit-slider">
    <Col span="1">
      <Tooltip>
        <template #title>
          <div class="edit-slider__text">
            <span> {{ t('layer') }} </span>
            <span> ctrl/cmd + &larr; </span>
          </div>
          <div class="edit-slider__text">
            <span> {{ t('component') }} </span>
            <span> ctrl/cmd + &uarr; </span>
          </div>
          <div class="edit-slider__text">
            <span> {{ t('right') }} </span>
            <span> ctrl/cmd + &rarr; </span>
          </div>
        </template>
        <MacCommandOutlined class="edit-slider__icon" />
      </Tooltip>
    </Col>
    <Col span="2">
      <InputNumber
        v-model:value="page.config.scale"
        size="small"
        :min="30"
        :max="150"
        :formatter="value => `${value}%`"
      />
    </Col>
    <Col span="4" class="edit-slider__col">
      <Slider
        v-model:value="page.config.scale"
        size="small"
        :min="30"
        :max="150"
        :step="10"
        :tip-formatter="value => `${value}%`"
        @change="handleSliderChange"
      />
    </Col>
    <Col span="1" class="edit-slider__col">
      <BlockOutlined class="edit-slider__icon" @click="switchThumbnail" />
    </Col>
  </footer>

  <BoardMenu v-if="menu.board.show" :menu-type="MenuEnum.BOARD" :container="canvasWrapperRef" />
</template>

<script lang="ts" setup>
import { BoardBox, BoardMenu, BoardShape, BoardRuler } from '@/components';
import { useBoardStore, useMenuStore, usePageStore, MenuEnum } from '@/store';
import {
  useSelectMask,
  useThumbnail,
  useEditSlider,
  useRuler,
  useBoardKeydown,
} from './hooks/board';
import { patchUnit, splitStyleAndPatch } from '@/utils';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  BlockOutlined,
  MacCommandOutlined,
} from '@ant-design/icons-vue';
import { computed, onBeforeUpdate, onMounted, reactive, shallowRef } from 'vue';
import { Col, Tooltip, InputNumber, Slider } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { board as messages } from '@/locales';

const board = useBoardStore();
const page = usePageStore();
const menu = useMenuStore();
const { selectMask, handleMousedown } = useSelectMask();
const position = reactive({ left: 0, top: 0 });
const screenShotRef = shallowRef<HTMLElement>();
const canvasWrapperRef = shallowRef<HTMLElement>();
const boardDom = shallowRef<HTMLElement>();
const { t } = useI18n({ useScope: 'local', messages });

const pageStyle = computed(() => {
  const { width, height, backgroundColor, scale } = page.config;
  return { width, height, backgroundColor, scale };
});

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  const type = e.dataTransfer?.getData('type');
  const label = e.dataTransfer?.getData('label');
  if (!type || !canvasWrapperRef.value) return;
  const { offsetX: left, offsetY: top } = e;
  board.append({ type, label, left, top });
  canvasWrapperRef.value.click();
};

const { handleSliderChange, screenShotSize, rulerKey } = useEditSlider(canvasWrapperRef);

const {
  viewportSize,
  thumbnailRef,
  handleThumbnailMousedown,
  syncScroll,
  showThumbnail,
  switchThumbnail,
} = useThumbnail(screenShotRef, canvasWrapperRef, rulerKey);

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  window.requestAnimationFrame(() => {
    const { scrollLeft, scrollTop } = target;
    position.left = -scrollLeft;
    position.top = -scrollTop;
    syncScroll();
  });
};

const {
  showMarkline,
  rulerData,
  getStyle,
  getUnit,
  addMarkline,
  handleRulerMouseMove,
  handleRulerMouseOut,
  switchMarklineDisplay,
  cancelMarkline,
} = useRuler();

useBoardKeydown();

onBeforeUpdate(() => {
  board.clearRefs();
});

onMounted(() => {
  if (!boardDom.value || !canvasWrapperRef.value) return;
  const { left, top } = boardDom.value.getBoundingClientRect();
  const { left: parentLeft, top: parentTop } = canvasWrapperRef.value.getBoundingClientRect();
  board.setOffset({ left: left - parentLeft, top: top - parentTop });
});
</script>

<style lang="less">
.board {
  position: absolute;
  background-color: @component-background;
  top: 60px;
  left: 60px;
  transform-origin: 0 0;
  transition: 0.2s all @ease-in-out;
  background-size: cover, contain;
  background-position: center, right bottom;
  background-repeat: no-repeat, no-repeat;
  box-shadow: @box-shadow-base;
  color: @black;

  &__component {
    pointer-events: none;
  }

  &__mask {
    position: absolute;
    opacity: 0.5;
    background-color: @primary-1;
    border: 1px solid @border-color-base;
  }
}

.canvas-wrapper {
  overflow: auto;
  position: relative;
  width: 100%;
  height: 100%;

  &:focus {
    outline: none;
    box-shadow: @box-shadow-base;
  }
}

.screen-shot {
  background-image: linear-gradient(90deg, transparent 50%, @component-background) 50%,
    linear-gradient(180deg, @component-background) 50%, transparent 50%;
  background-size: 10px 10px;
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
    border-right: 1px solid @border-color-base;
    border-bottom: 1px solid @border-color-base;
    width: 20px;
    height: 20px;
    font-size: 14px;
    cursor: pointer;
    position: fixed;
    z-index: 999;
    align-items: center;
    justify-content: center;
    display: flex;
    background-color: @component-background;

    &:hover {
      color: @primary-color;
    }
  }
}

.edit-slider {
  position: absolute;
  right: 0;
  bottom: 40px;
  background-color: @modal-footer-border-color-split;
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
      color: @text-color;
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
  transition: 0.3s transform @ease-in-out;

  &__canvas {
    width: 190px;
    height: 110px;
    background-color: rgba(0, 0, 0, 0.3);
  }

  span {
    position: absolute;
    outline: 1px solid @white;
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
  width: 0;
  border-left: 1px solid @primary-color;

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

  &.--dashed {
    border-left-style: dashed;
    pointer-events: none;
  }

  span {
    position: absolute;
    left: 5px;
    background-color: @primary-color;
    color: @white;
    padding: 0 3px;
  }
}
</style>

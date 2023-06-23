<template>
  <div ref="canvasWrapperRef" tabindex="-1" class="canvas-wrapper" @scroll="handleScroll">
    <div ref="screenShotRef" class="screen-shot" :style="patchUnit(screenShotSize)">
      <div class="fixed z-1">
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
import { Col, Tooltip, InputNumber, Slider, theme } from 'ant-design-vue';
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
const { token } = theme.useToken();

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
  top: 60px;
  left: 60px;
  transform-origin: 0 0;
  transition: 0.2s all v-bind('token.motionEaseInOut');
  background-size: cover, contain;
  background-position: center, right bottom;
  background-repeat: no-repeat, no-repeat;
  box-shadow: v-bind('token.boxShadow');
  color: v-bind('token.colorText');

  &__component {
    pointer-events: none;
  }

  &__mask {
    position: absolute;
    opacity: 0.5;
    background-color: v-bind("token['blue-1']");
    border: 1px solid v-bind('token.colorBorder');
  }
}

.canvas-wrapper {
  overflow: auto;
  position: relative;
  width: 100%;
  height: 100%;

  &:focus {
    outline: none;
    box-shadow: v-bind('token.boxShadow');
  }
}

.screen-shot {
  background-image: linear-gradient(90deg, transparent 50%, v-bind('token.colorBgTextActive')) 50%,
    linear-gradient(180deg, v-bind('token.colorBgTextHover')) 50%, transparent 50%;
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
    border-right: 1px solid v-bind('token.colorBorder');
    border-bottom: 1px solid v-bind('token.colorBorder');
    background-color: v-bind('token.colorBgBase');
    @apply w-20px h-20px text-14px cursor-pointer fixed z-999 items-center justify-center flex;

    &:hover {
      color: v-bind('token.colorPrimary');
    }
  }
}

.thumbnail {
  transition: 0.3s transform v-bind('token.motionEaseInOut');
  @apply absolute right-5px bottom-70px;

  &__canvas {
    @apply w-190px h-110px bg-black bg-opacity-30;
  }

  span {
    outline: 1px solid v-bind('token.colorWhite');
    @apply absolute z-2 top-0 left-0 cursor-move w-64px h-48px;
  }
}

.markline {
  border-left: 1px solid v-bind('token.colorPrimary');
  @apply absolute w-0;

  span {
    background-color: v-bind('token.colorPrimary');
    color: v-bind('token.colorWhite');
    @apply absolute left-5px px-3px;
  }

  &.--x {
    @apply top-20px h-screen transform -translate-y-full;

    span {
      @apply bottom-15px;
    }
  }

  &.--y {
    @apply top-0 h-screen;

    span {
      @apply top-15px;
    }
  }

  &.--dashed {
    @apply border-dashed pointer-events-none;
  }
}

.edit-slider {
  background-color: v-bind('token.colorBgBase');
  @apply w-full h-30px absolute right-0 bottom-40px flex items-center justify-end z-99;

  .ant-input-number {
    @apply w-auto;
  }

  &__col {
    @apply ml-10px text-16px;
  }

  &__icon {
    @apply cursor-pointer;

    &:hover {
      color: v-bind('token.colorText');
    }
  }

  &__text {
    @apply flex items-center justify-between;

    span:last-child {
      @apply ml-20px;
    }
  }
}
</style>

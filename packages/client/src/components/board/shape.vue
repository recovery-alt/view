<template>
  <div
    class="board-shape"
    :class="{ active }"
    @contextmenu="handleRightClick"
    @mousedown.stop="handleMousedown"
    @mouseup="handleMouseup"
  >
    <slot class="board-component" />
    <template v-if="active">
      <RedoOutlined class="shape-rotate" @mousedown="handleMousedownOnRotate" />
      <div
        v-for="point in points"
        :key="point"
        class="board-shape__point"
        :class="point"
        @mousedown="handleMousedownOnPoint"
      />
    </template>
    <template v-if="board.selected.includes(index)">
      <div class="board-shape__graticule --x" :style="patchUnit(graticule.x)"></div>
      <div class="board-shape__graticule --y" :style="patchUnit(graticule.y)"></div>
      <div class="board-shape__marker">{{ sizeText }}</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { BoardEnum, useStore } from '@/store';
import { pageConfig, showMenu, boardRefs, useEchartsResize } from '@/hooks';
import { on, off, patchUnit } from '@/utils';
import { throttle } from 'lodash';
import { computed, defineProps } from 'vue';
import { RedoOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  index: { type: Number, default: () => 0 },
  active: { type: Boolean, default: () => false },
});

const store = useStore();

const { board } = store.state;

const { handleEchartsResize } = useEchartsResize();

const graticule = computed(() => {
  const { left: boardLeft, top: boardTop } = board.data[props.index].style;
  const width = boardLeft + 60;
  const height = boardTop + 60;
  const left = -width;
  const top = -height;
  return { x: { width, left }, y: { height, top } };
});

const sizeText = computed(() => {
  const width = Math.floor((graticule.value.x.width - 60) * (pageConfig.scale / 100));
  const height = Math.floor((graticule.value.y.height - 60) * (pageConfig.scale / 100));
  return `${width},${height}`;
});

const points = [
  'top-left',
  'top-mid',
  'top-right',
  'mid-left',
  'mid-right',
  'bottom-left',
  'bottom-mid',
  'bottom-right',
];

const handleRightClick = (e: MouseEvent) => {
  e.preventDefault();
  if (!board.selected.includes(props.index)) {
    store.dispatch(BoardEnum.SET_INDEX, props.index);
  }
  showMenu(e, 'board', board);
};

const handleMousedown = (e: MouseEvent) => {
  if (e.buttons !== 1) return;
  // 没有按住ctrl的情况
  if (!e.ctrlKey && !e.metaKey) {
    if (!board.selected.includes(props.index)) {
      store.dispatch(BoardEnum.SET_INDEX, props.index);
    }
    const curComponents = board.selected.map(index => board.data[index]);
    const startX = e.clientX;
    const startY = e.clientY;
    const curPositions = curComponents.map(component => {
      const { left, top } = component.style;
      return { left, top };
    });

    const mousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const diffX = clientX - startX;
      const diffY = clientY - startY;
      curComponents.forEach((component, index) => {
        const { left, top } = curPositions[index];
        component.style.left = diffX + left;
        component.style.top = diffY + top;
      });
      // 计算吸附情况
      // judgeLineShow(board, curComponents);
    };

    const mouseup = (e: MouseEvent) => {
      e.stopPropagation();
      off('mousemove', mousemove);
      off('mouseup', mouseup);
    };

    on('mousemove', mousemove);
    on('mouseup', mouseup);
  }
};

const handleMouseup = (e: MouseEvent) => {
  if (e.ctrlKey || e.metaKey) {
    store.dispatch(BoardEnum.CHANGE_SELECTED, props.index);
  }
};

const handleMousedownOnPoint = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  // 多选情况下，强制改变为单选
  store.dispatch(BoardEnum.SET_INDEX, props.index);

  const { className } = e.target as HTMLElement;
  const hasLeft = className.includes('left');
  const hasRight = className.includes('right');
  const hasTop = className.includes('top');
  const hasBottom = className.includes('bottom');
  const { selected, data } = store.state.board;
  const curComponent = data[selected[0]];
  const { top, left, width, height } = curComponent.style;

  const startX = e.clientX;
  const startY = e.clientY;

  const mousemove = throttle((e: MouseEvent) => {
    e.stopPropagation();
    const { clientX, clientY } = e;
    if (hasLeft) {
      const diffX = clientX - startX;
      curComponent.style.width = width - diffX;
      curComponent.style.left = left + diffX;
    }
    if (hasRight) {
      const diffX = clientX - startX;
      curComponent.style.width = width + diffX;
    }
    if (hasTop) {
      const diffY = clientY - startY;
      curComponent.style.height = height - diffY;
      curComponent.style.top = top + diffY;
    }
    if (hasBottom) {
      const diffY = clientY - startY;
      curComponent.style.height = height + diffY;
    }
  }, 16);

  const mouseup = (e: MouseEvent) => {
    e.stopPropagation();
    off('mouseup', mouseup);
    off('mousemove', mousemove);
    handleEchartsResize(board.selected[0]);
  };

  on('mousemove', mousemove);
  on('mouseup', mouseup);
};

const handleMousedownOnRotate = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  // 多选情况下，强制改变为单选
  store.dispatch(BoardEnum.SET_INDEX, props.index);

  const startX = e.clientX;
  const startY = e.clientY;
  const curComponent = board.data[board.selected[0]];
  const { rotate: startRotate } = curComponent.style;
  const { left, top, width, height } = boardRefs[props.index].getBoundingClientRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  // 旋转前的角度
  const startAngle = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

  const mousemove = throttle((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const curAngle = Math.atan2(clientY - centerY, clientX - centerX) / (Math.PI / 180);
    curComponent.style.rotate = startRotate + curAngle - startAngle;
  }, 16);

  const mouseup = (e: MouseEvent) => {
    e.stopPropagation();
    off('mouseup', mouseup);
    off('mousemove', mousemove);
  };

  on('mousemove', mousemove);
  on('mouseup', mouseup);
};
</script>

<style lang="less">
@radius: 4px;

.board-shape {
  position: absolute;
  cursor: move;
  box-sizing: border-box;

  &:hover {
    background-color: var(--item-hover-bg);
    outline: 1px dashed var(--outline-color);
  }

  & > *:first-child {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .shape-rotate {
    position: absolute;
    color: var(--primary-color);
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    cursor: grab;
  }

  .board-component {
    height: 100%;
  }

  &.active {
    outline: 1px solid var(--outline-color);
  }

  &__graticule {
    position: absolute;

    &.--x {
      top: -1px;
      border-top: 1px solid var(--primary-color);
      height: 0;
    }
    &.--y {
      left: -1px;
      border-left: 1px solid var(--primary-color);
      width: 0;
    }
  }

  &__marker {
    position: absolute;
    top: -5px;
    left: -5px;
    font-size: 16px;
    color: var(--primary-color);
    transform: translate(-100%, -100%);
  }

  &__point {
    position: absolute;
    width: @radius * 2;
    height: @radius * 2;
    border: 1px solid var(--primary-color);
    box-sizing: border-box;
    border-radius: 50%;
    background-color: var(--popover-background);
    z-index: 1;
  }

  .top {
    &-left {
      left: -@radius;
      top: -@radius;
      cursor: se-resize;
    }

    &-mid {
      top: -@radius - 1px;
      left: 50%;
      margin-left: -@radius;
      cursor: s-resize;
    }

    &-right {
      top: -@radius;
      right: -@radius;
      cursor: ne-resize;
    }
  }

  .mid {
    &-left {
      left: -@radius;
      top: 50%;
      margin-top: -@radius;
      cursor: w-resize;
    }

    &-right {
      right: -@radius;
      top: 50%;
      margin-top: -@radius;
      cursor: w-resize;
    }
  }

  .bottom {
    &-left {
      left: -@radius;
      bottom: -@radius;
      cursor: ne-resize;
    }

    &-mid {
      left: 50%;
      bottom: -@radius - 1px;
      margin-left: -@radius;
      cursor: s-resize;
    }

    &-right {
      right: -@radius;
      bottom: -@radius;
      cursor: se-resize;
    }
  }
}
</style>

<template>
  <div
    :class="`shape${active ? ' active' : ''}`"
    @click="handleShapeClick"
    @mousedown="handleMousedown"
    ref="shape"
  >
    <slot />
    <template v-if="active">
      <div
        v-for="point in points"
        :key="point"
        :class="`point ${point}`"
        @mousedown="handleMousedowOnPoint"
      ></div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from '@/store';
import { judgeLineShow, hideAllLines } from '@/hooks';
import { BoardEnum } from '@/store/modules/board';
import { on, off } from '@/utils';
import { throttle } from 'lodash';
import { showMenu } from '@/hooks';

const name = 'board-shape';

type Props = {
  index: number;
  active: boolean;
};

const props = {
  index: { type: Number, default: () => 0 },
  active: { type: Boolean, default: () => false },
};

const setup = (props: Props) => {
  const store = useStore();

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
    showMenu(e);
  };

  const handleShapeClick = (e: MouseEvent) => {
    e.stopPropagation();
    store.commit(BoardEnum.SET_INDEX, props.index);
    if (e.buttons === 2) {
      handleRightClick(e);
    }
  };

  const handleMousedown = (e: MouseEvent) => {
    if (e.buttons !== 1) return;
    e.stopPropagation();
    store.commit(BoardEnum.SET_INDEX, props.index);
    const board = store.state.board;
    const curComponent = board.data[board.index];
    const startX = e.clientX;
    const startY = e.clientY;
    const { left, top } = curComponent.style;

    const mousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const diffX = clientX - startX;
      const diffY = clientY - startY;
      curComponent.style.left = diffX + left;
      curComponent.style.top = diffY + top;
      // 计算吸附情况
      judgeLineShow(board, curComponent);
    };

    const mouseup = () => {
      off('mousemove', mousemove);
      off('mouseup', mouseup);
      hideAllLines();
    };

    on('mousemove', mousemove);
    on('mouseup', mouseup);
  };

  const handleMousedowOnPoint = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const { className } = e.target as HTMLElement;
    const hasLeft = className.includes('left');
    const hasRight = className.includes('right');
    const hasTop = className.includes('top');
    const hasBottom = className.includes('bottom');
    const { index, data } = store.state.board;
    const curComponent = data[index];
    const { top, left, width, height } = curComponent.style;

    const startX = e.clientX;
    const startY = e.clientY;

    const mousemove = throttle((e: MouseEvent) => {
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
    }, 30);

    const mouseup = () => {
      off('mouseup', mouseup);
      off('mousemove', mousemove);
    };

    on('mousemove', mousemove);
    on('mouseup', mouseup);
  };

  return { handleShapeClick, handleMousedown, points, handleMousedowOnPoint };
};

export default defineComponent({ name, props, setup });
</script>

<style lang="scss" scoped>
$radius: 5px;

.shape {
  position: absolute;
  cursor: move;

  &.active {
    outline: 1px solid $el-primary-2;
  }
}

.point {
  position: absolute;
  width: $radius * 2;
  height: $radius * 2;
  border: 1px solid $el-primary-2;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: $el-white;
}

.top {
  &-left {
    left: -$radius;
    top: -$radius;
    cursor: se-resize;
  }

  &-mid {
    top: -$radius;
    left: 50%;
    margin-left: -$radius;
    cursor: s-resize;
  }

  &-right {
    top: -$radius;
    right: -$radius;
    cursor: ne-resize;
  }
}

.mid {
  &-left {
    left: -$radius;
    top: 50%;
    margin-top: -$radius;
    cursor: w-resize;
  }

  &-right {
    right: -$radius;
    top: 50%;
    margin-top: -$radius;
    cursor: w-resize;
  }
}

.bottom {
  &-left {
    left: -$radius;
    bottom: -$radius;
    cursor: ne-resize;
  }

  &-mid {
    left: 50%;
    bottom: -$radius;
    margin-left: -$radius;
    cursor: s-resize;
  }

  &-right {
    right: -$radius;
    bottom: -$radius;
    cursor: se-resize;
  }
}
</style>

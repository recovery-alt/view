<template>
  <div
    :class="`shape${active ? ' active' : ''}`"
    @click="handleShapeClick"
    @mousedown="handleMousedown"
    :style="style"
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
import { useStore } from 'vuex';
import { judgeLineShow, hideAllLines } from '@/hooks';
import { BoardEnum } from '@/store/modules/board';
import { on, off } from '@/utils';
import { throttle } from 'lodash';

const name = 'board-shape';

type Props = {
  index: number;
  active: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
};

const props = {
  index: { type: Number, default: () => 0 },
  active: { type: Boolean, default: () => false },
  left: { type: Number, default: () => 0 },
  top: { type: Number, default: () => 0 },
  width: { type: Number, default: () => 0 },
  height: { type: Number, default: () => 0 },
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

  const style = computed(() => ({
    top: `${props.top}px`,
    left: `${props.left}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
  }));

  const handleShapeClick = (e: Event) => {
    e.stopPropagation();
    store.commit(BoardEnum.SET_INDEX, props.index);
  };

  const handleMousedown = (e: MouseEvent) => {
    if (e.buttons !== 1) return;
    e.stopPropagation();
    store.commit(BoardEnum.SET_INDEX, props.index);
    const board = store.getters[BoardEnum.GET_BOARD];
    const curComponent = store.getters[BoardEnum.GET_CUR_COMPONENT];
    const startX = e.clientX;
    const startY = e.clientY;
    const { left, top } = curComponent.position;

    const mousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const diffX = clientX - startX;
      const diffY = clientY - startY;
      curComponent.position.left = diffX + left;
      curComponent.position.top = diffY + top;
      // 计算吸附情况
      const lineShow = throttle(judgeLineShow);
      lineShow(board, curComponent);
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
    const curComponent = store.getters[BoardEnum.GET_CUR_COMPONENT];
    const { top, left, width, height } = curComponent.position;

    const startX = e.clientX;
    const startY = e.clientY;

    const mousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (hasLeft) {
        const diffX = clientX - startX;
        curComponent.position.width = width - diffX;
        curComponent.position.left = left + diffX;
      }
      if (hasRight) {
        const diffX = clientX - startX;
        curComponent.position.width = width + diffX;
      }
      if (hasTop) {
        const diffY = clientY - startY;
        curComponent.position.height = height - diffY;
        curComponent.position.top = top + diffY;
      }
      if (hasBottom) {
        const diffY = clientY - startY;
        curComponent.position.height = height + diffY;
      }
    };

    const mouseup = () => {
      off('mouseup', mouseup);
      off('mousemove', mousemove);
    };

    on('mousemove', mousemove);
    on('mouseup', mouseup);
  };

  return { handleShapeClick, handleMousedown, points, style, handleMousedowOnPoint };
};

export default defineComponent({ name, props, setup });
</script>

<style lang="scss" scoped>
$radius: 3px;

.shape {
  position: absolute;
  cursor: move;

  &.active {
    outline: 1px solid #70c0ff;
  }
}

.point {
  position: absolute;
  width: $radius * 2;
  height: $radius * 2;
  border: 1px solid #59c7f9;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: #fff;
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

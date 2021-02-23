<template>
  <div
    class="board-shape"
    :class="{ active }"
    @click="handleShapeClick"
    @mousedown.stop="handleMousedown"
    @mouseup="handleMouseup"
  >
    <slot />
    <template v-if="active">
      <!-- <i class="shape-rotate el-icon-refresh-right" @mousedown="handleMousedownOnRotate" /> -->
      <div
        v-for="point in points"
        :key="point"
        class="point"
        :class="point"
        @mousedown="handleMousedownOnPoint"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { judgeLineShow, hideAllLines } from '@/hooks';
import { BoardEnum } from '@/store/modules/board';
import { SnapshotEnum } from '@/store/modules/snapshot';
import { on, off } from '@/utils';
import { throttle } from 'lodash';
import { showMenu, useBoardRefs } from '@/hooks';

export default {
  name: 'board-shape',
  props: {
    index: { type: Number, default: () => 0 },
    active: { type: Boolean, default: () => false },
  },
  setup(props) {
    const store = useStore();

    const board = store.state.board;

    const { handleEchartsResize } = useBoardRefs();

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
      if (e.buttons === 2) {
        handleRightClick(e);
      }
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
          judgeLineShow(board, curComponents);
        };

        const mouseup = (e: MouseEvent) => {
          e.stopPropagation();
          store.dispatch(SnapshotEnum.RECORD_SNAPSHOT);
          off('mousemove', mousemove);
          off('mouseup', mouseup);
          hideAllLines();
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
        handleEchartsResize(board.selected[0]);
        store.dispatch(SnapshotEnum.RECORD_SNAPSHOT);
        off('mouseup', mouseup);
        off('mousemove', mousemove);
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
      const { boardRefs } = useBoardRefs();
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
        store.dispatch(SnapshotEnum.RECORD_SNAPSHOT);
        off('mouseup', mouseup);
        off('mousemove', mousemove);
      };

      on('mousemove', mousemove);
      on('mouseup', mouseup);
    };

    return {
      handleShapeClick,
      handleMousedown,
      points,
      handleMousedownOnPoint,
      handleMouseup,
      handleMousedownOnRotate,
    };
  },
};
</script>

<style lang="scss" scoped>
$radius: 4px;

.board-shape {
  position: absolute;
  cursor: move;
  box-sizing: border-box;

  &.active {
    outline: 1px dashed $el-primary-2;
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
    top: -$radius - 1px;
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
    bottom: -$radius - 1px;
    margin-left: -$radius;
    cursor: s-resize;
  }

  &-right {
    right: -$radius;
    bottom: -$radius;
    cursor: se-resize;
  }
}

// .shape-rotate {
//   position: absolute;
//   color: $el-primary-2;
//   top: -30px;
//   left: 50%;
//   transform: translateX(-50%);
//   cursor: grab;
// }
</style>

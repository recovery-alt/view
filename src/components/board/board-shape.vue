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

const name = 'board-shape';

type Props = { index: number; active: boolean; left: number; top: number };

const props = {
  index: { type: Number, default: () => 0 },
  active: { type: Boolean, default: () => false },
  left: { type: Number, default: () => 0 },
  top: { type: Number, default: () => 0 },
};

const setup = (props: Props) => {
  const shape = ref<HTMLElement | null>(null);

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

  const style = computed(() => ({ top: `${props.top}px`, left: `${props.left}px` }));

  const handleShapeClick = (e: Event) => {
    e.stopPropagation();
    store.commit('board/setIndex', props.index);
  };

  const handleMousedown = (e: MouseEvent) => {
    if (e.buttons !== 1) return;
    e.stopPropagation();
    store.commit('board/setIndex', props.index);
    const curComponent = store.getters['board/getCurComponent'];
    const startX = e.clientX;
    const startY = e.clientY;
    const { left, top } = curComponent.position;

    const mousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      curComponent.position.left = clientX - startX + left;
      curComponent.position.top = clientY - startY + top;
    };

    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  const handleMousedowOnPoint = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!shape.value) return;
    const { className } = e.target as HTMLElement;
    const hasLeft = className.includes('left');
    const hasRight = className.includes('right');
    const hasTop = className.includes('top');
    const hasBottom = className.includes('bottom');
    const curComponent = store.getters['board/getCurComponent'];
    const { width, height } = shape.value.getBoundingClientRect();
    const { top, left } = curComponent.position;
    curComponent.style.width = width + 'px';
    curComponent.style.height = height + 'px';
    const startX = e.clientX;
    const startY = e.clientY;

    const mousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (!width || !height) return;
      if (hasLeft) {
        const diffX = clientX - startX;
        curComponent.style.width = width - diffX + 'px';
        curComponent.position.left = left + diffX;
      }
      if (hasRight) {
        const diffX = clientX - startX;
        curComponent.style.width = width + diffX + 'px';
      }
      if (hasTop) {
        const diffY = clientY - startY;
        curComponent.style.height = height - diffY + 'px';
        curComponent.position.top = top + diffY;
      }
      if (hasBottom) {
        const diffY = clientY - startY;
        curComponent.style.height = height + diffY + 'px';
      }
    };

    const mouseup = () => {
      document.removeEventListener('mouseup', mouseup);
      document.removeEventListener('mousemove', mousemove);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  return { handleShapeClick, handleMousedown, points, style, shape, handleMousedowOnPoint };
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

<template>
  <div class="board-menu" @mousedown.stop @mouseup.stop>
    <ul>
      <li v-for="item in data" :key="item.name" @click="e => handleClick(e, item.event)">
        <i :class="`el-icon-${item.icon}`" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { BoardEnum } from '@/store/modules/board';
import { getMenuPosition } from '@/utils';

export default {
  name: 'BoardMenu',
  props: {
    modelValue: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore();
    const data = [
      {
        name: '剪切',
        icon: 'scissors',
        event: () => store.dispatch(BoardEnum.CUT),
      },
      {
        name: '复制',
        icon: 'document-copy',
        event: () => store.dispatch(BoardEnum.COPY),
      },
      {
        name: '粘贴',
        icon: 'brush',
        event: () => {
          const menuPosition = getMenuPosition();
          if (!menuPosition) return;
          store.dispatch(BoardEnum.PASTE, menuPosition);
        },
      },
      {
        name: '删除',
        icon: 'delete',
        event: () => store.dispatch(BoardEnum.DEL),
      },
      {
        name: '置顶',
        icon: 'arrow-up',
        event: () => store.dispatch(BoardEnum.MOVE_UP, true),
      },
      {
        name: '置底',
        icon: 'arrow-down',
        event: () => store.dispatch(BoardEnum.MOVE_DOWN, true),
      },
      {
        name: '上移一层',
        icon: 'top',
        event: () => store.dispatch(BoardEnum.MOVE_UP),
      },
      {
        name: '下移一层',
        icon: 'bottom',
        event: () => store.dispatch(BoardEnum.MOVE_DOWN),
      },
    ];

    // 处理菜单消失
    const handleClick = (e: MouseEvent, cb: () => void) => {
      e.stopPropagation();
      emit('update:modelValue', false);
      cb();
    };

    return { data, handleClick };
  },
};
</script>

<style lang="scss" scoped>
.board-menu {
  position: absolute;

  ul {
    background-color: $el-info-3;
    border-radius: 5px;
    box-shadow: $el-shadow-1;
    padding: 5px 0;
  }

  li {
    padding: 0 10px;
    margin-top: 5px;
    border-radius: 3px;
    cursor: default;

    &:hover {
      background-color: $el-primary-1;
      color: $el-white;
    }
  }

  span {
    margin-left: 5px;
  }
}
</style>

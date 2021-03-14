<template>
  <div class="board-menu" @mousedown.stop @mouseup.stop>
    <ul>
      <li v-for="item in data" :key="item.name" @click="e => handleClick(e, item.event)">
        <component :is="item.icon" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { BoardEnum } from '@/store';
import { getMenuPosition } from '@/utils';
import {
  ScissorOutlined,
  CopyOutlined,
  DiffOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'board-menu',
  components: {
    ScissorOutlined,
    CopyOutlined,
    DiffOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    UpOutlined,
    DownOutlined,
  },
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
        icon: 'ScissorOutlined',
        event: () => store.dispatch(BoardEnum.CUT),
      },
      {
        name: '复制',
        icon: 'CopyOutlined',
        event: () => store.dispatch(BoardEnum.COPY),
      },
      {
        name: '粘贴',
        icon: 'DiffOutlined',
        event: () => {
          const menuPosition = getMenuPosition();
          if (!menuPosition) return;
          store.dispatch(BoardEnum.PASTE, menuPosition);
        },
      },
      {
        name: '删除',
        icon: 'DeleteOutlined',
        event: () => store.dispatch(BoardEnum.DEL),
      },
      {
        name: '置顶',
        icon: 'ArrowUpOutlined',
        event: () => store.dispatch(BoardEnum.MOVE_UP, true),
      },
      {
        name: '置底',
        icon: 'ArrowDownOutlined',
        event: () => store.dispatch(BoardEnum.MOVE_DOWN, true),
      },
      {
        name: '上移一层',
        icon: 'UpOutlined',
        event: () => store.dispatch(BoardEnum.MOVE_UP),
      },
      {
        name: '下移一层',
        icon: 'DownOutlined',
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

<style lang="less" scoped>
.board-menu {
  position: absolute;

  ul {
    background-color: @normal-color;
    border-radius: 5px;
    box-shadow: @shadow-color;
    padding: 5px 0;
  }

  li {
    padding: 0 10px;
    margin-top: 5px;
    border-radius: 3px;
    cursor: default;

    &:hover {
      background-color: @primary-8;
      color: @white;
    }
  }

  span {
    margin-left: 5px;
  }
}
</style>

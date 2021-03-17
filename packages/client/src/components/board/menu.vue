<template>
  <div class="board-menu" @mousedown.stop @mouseup.stop>
    <ul>
      <li v-for="item in data" :key="item.name" @click="handleClick($event, item.event)">
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
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  FolderOutlined,
  FolderOpenOutlined,
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
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    FolderOutlined,
    FolderOpenOutlined,
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
        name: '置顶',
        icon: 'VerticalAlignTopOutlined',
        event: () => store.dispatch(BoardEnum.MOVE_UP, true),
      },
      {
        name: '置底',
        icon: 'VerticalAlignBottomOutlined',
        event: () => store.dispatch(BoardEnum.MOVE_DOWN, true),
      },
      {
        name: '上移一层',
        icon: 'ArrowUpOutlined',
        event: () => store.dispatch(BoardEnum.MOVE_UP),
      },
      {
        name: '下移一层',
        icon: 'ArrowDownOutlined',
        event: () => store.dispatch(BoardEnum.MOVE_DOWN),
      },

      {
        name: '成组',
        icon: 'FolderOutlined',
        event: () => store.dispatch(BoardEnum.GROUP),
      },
      {
        name: '取消成组',
        icon: 'FolderOpenOutlined',
        event: () => store.dispatch(BoardEnum.CANCEL_GROUP),
      },

      {
        name: '锁定',
        icon: 'FolderOpenOutlined',
        event: () => null,
      },
      {
        name: '隐藏',
        icon: 'FolderOpenOutlined',
        event: () => null,
      },

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

<style lang="less">
.board-menu {
  position: absolute;

  ul {
    background-color: var(--normal-color);
    border-radius: 5px;
    box-shadow: var(--box-shadow-base);
    padding: 5px 0;
  }

  li {
    padding: 0 10px;
    margin-top: 5px;
    cursor: default;
    padding-right: 3em;

    &:hover {
      background-color: var(--primary-8);
      color: var(--component-background);
    }

    &:nth-child(4),
    &:nth-child(8) {
      border-bottom: 1px solid var(--black);
    }
  }

  span {
    margin-left: 5px;
  }
}
</style>

<template>
  <div
    ref="menuRef"
    class="board-menu"
    :style="patchUnit(menu[menuType].style)"
    @mousedown.stop
    @mouseup.stop
  >
    <ul>
      <li
        v-for="item in data"
        :key="item.name"
        :class="{ '--disable': item.disable }"
        @click="handleClick($event, item.disable, item.event)"
      >
        <component :is="item.icon" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useStore, BoardEnum } from '@/store';
import { judgeCancelGroupDisabled, judgeGroupDisabled, on, patchUnit } from '@/utils';
import {
  CopyOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons-vue';
import { reactive, onMounted, PropType, defineComponent, shallowRef } from 'vue';
import { MenuType, menu } from '@/hooks';

export default defineComponent({
  name: 'board-menu',
  components: {
    CopyOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    FolderOutlined,
    FolderOpenOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
  },
  props: {
    menuType: {
      type: String as PropType<MenuType>,
      default: () => 'board',
    },
    container: Object as PropType<HTMLElement>,
  },
  setup(props) {
    const store = useStore();

    const { board } = store.state;

    const menuRef = shallowRef<HTMLElement>();

    const data = reactive([
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
        disable: false,
        event: () => store.dispatch(BoardEnum.GROUP),
      },
      {
        name: '取消成组',
        icon: 'FolderOpenOutlined',
        disable: false,
        event: () => store.dispatch(BoardEnum.CANCEL_GROUP),
      },

      {
        name: '锁定',
        icon: 'LockOutlined',
        disable: false,
        event: () => store.dispatch(BoardEnum.TOGGLE_LOCKED, board.selected),
      },
      {
        name: '隐藏',
        icon: 'EyeInvisibleOutlined',
        disable: false,
        event: () => store.dispatch(BoardEnum.HIDE, board.selected),
      },
      {
        name: '复制',
        icon: 'CopyOutlined',
        event: () => store.dispatch(BoardEnum.COPY),
      },
      {
        name: '删除',
        icon: 'DeleteOutlined',
        event: () => store.dispatch(BoardEnum.DEL),
      },
    ]);

    // 处理菜单消失
    const handleClick = (e: MouseEvent, disable: boolean | undefined, cb: () => void) => {
      e.stopPropagation();
      if (disable) {
        e.preventDefault();
        return;
      }
      menu[props.menuType].show = false;
      cb();
    };

    const handleCancelMenu = () => {
      on('click', e => {
        e.stopPropagation();
        e.preventDefault();
        Object.keys(menu).forEach(key => {
          menu[key].show = false;
        });
      });
    };

    onMounted(() => {
      data[4].disable = judgeGroupDisabled(board);
      data[5].disable = judgeCancelGroupDisabled(board);
      menu[props.menuType].ref = menuRef.value;
      menu[props.menuType].container = props.container;
      handleCancelMenu();
    });

    return { menu, menuRef, data, handleClick, patchUnit };
  },
});
</script>

<style lang="less">
.board-menu {
  position: absolute;
  z-index: 2;

  ul {
    background-color: var(--component-background);
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
      background-color: var(--primary-color);
      color: var(--text-color-inverse);
    }

    &:nth-child(4),
    &:nth-child(8) {
      border-bottom: 1px solid var(--border-color-base);
    }

    &.--disable {
      cursor: not-allowed;
      opacity: 0.3;

      &:hover {
        color: var(--text-color-inverse);
        background-color: var(--item-hover-bg);
      }
    }
  }

  span {
    margin-left: 5px;
  }
}
</style>

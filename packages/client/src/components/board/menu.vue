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

<script lang="ts" setup>
import { MenuEnum, useMenuStore } from '@/store';
import type { Component, PropType } from 'vue';
import { useBoardStore } from '@/store';
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
import { reactive, onMounted, shallowRef } from 'vue';

const props = defineProps({
  menuType: {
    type: String as PropType<MenuEnum>,
    default: () => 'board',
  },
  container: Object as PropType<HTMLElement>,
});

const board = useBoardStore();
const menu = useMenuStore();

const menuRef = shallowRef<HTMLElement>();

type MenuList = Array<{ name: string; icon: Component; event: () => void; disable?: boolean }>;

const data = reactive<MenuList>([
  {
    name: '置顶',
    icon: VerticalAlignTopOutlined,
    event: () => board.moveUp(true),
  },
  {
    name: '置底',
    icon: VerticalAlignBottomOutlined,
    event: () => board.moveDown(true),
  },
  {
    name: '上移一层',
    icon: ArrowUpOutlined,
    event: () => board.moveUp(),
  },
  {
    name: '下移一层',
    icon: ArrowDownOutlined,
    event: () => board.moveDown(),
  },

  {
    name: '成组',
    icon: FolderOutlined,
    disable: false,
    event: () => board.group(),
  },
  {
    name: '取消成组',
    icon: FolderOpenOutlined,
    disable: false,
    event: () => board.cancelGroup(),
  },

  {
    name: '锁定',
    icon: LockOutlined,
    disable: false,
    event: () => board.toggleLocked(board.selected),
  },
  {
    name: '隐藏',
    icon: EyeInvisibleOutlined,
    disable: false,
    event: () => board.hide(board.selected),
  },
  {
    name: '复制',
    icon: CopyOutlined,
    event: () => board.copy(),
  },
  {
    name: '删除',
    icon: DeleteOutlined,
    event: () => board.del(),
  },
]);

// 处理菜单消失
const handleClick = (e: MouseEvent, disable: boolean | undefined, cb: () => void) => {
  e.stopPropagation();
  if (disable) {
    e.preventDefault();
    return;
  }
  menu.hide(props.menuType);
  cb();
};

const handleCancelMenu = () => {
  on('click', e => {
    e.stopPropagation();
    e.preventDefault();
    menu.hideAll();
  });
};

onMounted(() => {
  data[4].disable = judgeGroupDisabled(board);
  data[5].disable = judgeCancelGroupDisabled(board);
  menu.setRefAndContainer(props.menuType, menuRef.value, props.container);
  handleCancelMenu();
});
</script>

<style lang="less">
.board-menu {
  position: absolute;
  z-index: 2;
  color: @text-color;

  ul {
    background-color: @layout-body-background;
    border-radius: 5px;
    box-shadow: @box-shadow-base;
    padding: 5px 0;
  }

  li {
    padding: 0 10px;
    margin-top: 5px;
    cursor: default;
    padding-right: 3em;

    &:hover {
      background-color: @primary-color;
      color: @text-color-inverse;
    }

    &:nth-child(4),
    &:nth-child(8) {
      border-bottom: 1px solid @border-color-base;
    }

    &.--disable {
      cursor: not-allowed;
      opacity: 0.3;

      &:hover {
        color: @text-color;
        background-color: @item-hover-bg;
      }
    }
  }

  span {
    margin-left: 5px;
  }
}
</style>

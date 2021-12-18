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
import { useI18n } from 'vue-i18n';
import { menu as messages } from '@/locales';

const props = defineProps({
  menuType: {
    type: String as PropType<MenuEnum>,
    default: () => 'board',
  },
  container: Object as PropType<HTMLElement>,
});

const board = useBoardStore();
const menu = useMenuStore();
const { t } = useI18n({ useScope: 'local', messages });
const { t: gt } = useI18n({ useScope: 'global' });

const menuRef = shallowRef<HTMLElement>();

type MenuList = Array<{ name: string; icon: Component; event: () => void; disable?: boolean }>;

const data = reactive<MenuList>([
  {
    name: t('top'),
    icon: VerticalAlignTopOutlined,
    event: () => board.moveUp(true),
  },
  {
    name: t('bottom'),
    icon: VerticalAlignBottomOutlined,
    event: () => board.moveDown(true),
  },
  {
    name: t('up'),
    icon: ArrowUpOutlined,
    event: () => board.moveUp(),
  },
  {
    name: t('down'),
    icon: ArrowDownOutlined,
    event: () => board.moveDown(),
  },

  {
    name: t('group'),
    icon: FolderOutlined,
    disable: false,
    event: () => board.group(gt('gallery.group')),
  },
  {
    name: t('cancelGroup'),
    icon: FolderOpenOutlined,
    disable: false,
    event: () => board.cancelGroup(),
  },

  {
    name: t('lock'),
    icon: LockOutlined,
    disable: false,
    event: () => board.toggleLocked(board.selected),
  },
  {
    name: t('hide'),
    icon: EyeInvisibleOutlined,
    disable: false,
    event: () => board.hide(board.selected),
  },
  {
    name: t('copy'),
    icon: CopyOutlined,
    event: () => board.copy(),
  },
  {
    name: t('delete'),
    icon: DeleteOutlined,
    event: () => board.del(gt),
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

<template>
  <div ref="layerRef" :class="['layer-panel', panel.layer ? 'w-200px' : 'w-0 border-0']">
    <header class="layer-panel__header">
      <div>{{ t('layer') }}</div>
      <section class="flex">
        <component
          :is="item.icon"
          v-for="item in modeList"
          :key="item.key"
          :class="{ '--active': item.key === mode }"
          @click="switchMode(item.key)"
        />
        <LeftOutlined @click="panel.switchPanelShow('layer')" />
      </section>
    </header>
    <section class="h-[calc(100%-60px)]">
      <header class="layer-panel__toolbar">
        <Tooltip
          v-for="item in moveActions"
          :key="item.icon.name"
          placement="bottom"
          :title="item.tip"
        >
          <component
            :is="item.icon"
            :class="{ 'opacity-30': reverseBoard.selected.length === 0 }"
            @click="item.event"
          />
        </Tooltip>
      </header>
      <ul
        v-if="reverseBoard.data.length"
        class="layer-panel__box h-[calc(100%-30px)] overflow-x-hidden overflow-y-auto"
      >
        <li v-for="(item, index) in reverseBoard.data" :key="item.id">
          <div
            :class="[
              'layer-panel__box-item',
              `--${mode}`,
              { '--active': reverseBoard.selected.includes(index) },
            ]"
            @contextmenu="handleRightClick($event, index)"
            @mouseup="changeSelected($event, index)"
          >
            <component
              :is="item.locked ? LockOutlined : EyeInvisibleOutlined"
              v-if="item.locked || item.style.display === 'none'"
              class="--icon"
              @click="unlockOrShow($event, index, item.locked)"
            />
            <CaretRightOutlined
              v-if="item.group?.length"
              class="--animated"
              :style="{ transform: toggleState[item.id] ? 'rotate(90deg)' : 'rotate(0deg)' }"
              @click="toggleState[item.id] = !toggleState[item.id]"
            />
            <DatabaseOutlined v-else-if="mode === 'item'" />
            <img v-else :src="getImgSrc(item.component)" />
            <b>{{ item.label }}</b>
          </div>
          <transition name="toggle" mode="out-in">
            <ul v-if="toggleState[item.id]" class="layer-panel__box-submenu">
              <li
                v-for="child in item.group"
                :key="child.id"
                :class="['layer-panel__box-item', '--animated', `--${mode}`]"
              >
                <DatabaseOutlined v-if="mode === 'item'" />
                <img v-else :src="getImgSrc(item.component)" />
                <b>{{ child.label }}</b>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
      <Empty v-else class="mt-20px" :description="t('tip')" />
      <BoardMenu v-if="menu.layer.show" :menu-type="MenuEnum.LAYER" :container="layerRef" />
    </section>
    <footer class="layer-panel__footer">
      <Tooltip
        v-for="(item, i) in operations"
        :key="item.icon.name"
        placement="bottom"
        :title="item.tip"
      >
        <component
          :is="item.icon"
          :key="item.icon.name"
          :class="{ 'opacity-30': operationActions[i]?.disable }"
          @click="operationActions[i]?.disable || item.event()"
        />
      </Tooltip>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  DatabaseOutlined,
  LeftOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  CaretRightOutlined,
} from '@ant-design/icons-vue';
import { shallowRef } from 'vue';
import { useBoardStore, useMenuStore, usePanelStore, MenuEnum } from '@/store';
import { BoardMenu } from '@/components';
import { Empty, Tooltip, theme } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { layerPanel as messages } from '@/locales';
import { useFooter, useMode, useReverse, useToggle, useToolBar } from './hook';
import { getImgSrc } from '@/gallery';

const board = useBoardStore();
const panel = usePanelStore();
const menu = useMenuStore();
const { token } = theme.useToken();
const layerRef = shallowRef<HTMLElement>();
const { t } = useI18n({ useScope: 'local', messages });
const { moveActions } = useToolBar();
const { operations, operationActions } = useFooter();
const { mode, modeList, switchMode } = useMode();
const { toggleState } = useToggle();
const { reverseBoard } = useReverse();

function getIndex(reverseIndex: number) {
  return board.data.length - reverseIndex - 1;
}

function unlockOrShow(e: MouseEvent, reverseIndex: number, lock?: boolean) {
  e.stopPropagation();
  const index = getIndex(reverseIndex);
  lock ? board.toggleLocked(index) : board.show(index);
}

function changeSelected(e: MouseEvent, reverseIndex: number) {
  const index = getIndex(reverseIndex);
  if (e.ctrlKey || e.metaKey) {
    board.changeSelected(index);
  } else {
    board.setIndex(index);
  }
}

function handleRightClick(e: MouseEvent, reverseIndex: number) {
  e.preventDefault();
  if (!reverseBoard.value.selected.includes(reverseIndex)) {
    const index = getIndex(reverseIndex);
    board.setIndex(index);
  }
  menu.show(e, MenuEnum.LAYER, board);
}
</script>

<style lang="less">
.layer-panel {
  border-right: 1px solid v-bind('token.colorBorder');
  transition: width 0.3s v-bind('token.motionEaseInOut');
  background-color: v-bind('token.colorBgBase');
  color: v-bind('token.colorText');
  @apply relative h-full z-4 overflow-hidden whitespace-normal;

  &__toolbar {
    border-bottom: 1px solid v-bind('token.colorBorder');
    background-color: v-bind('token.colorBgBase');
    @apply h-30px flex items-center justify-between box-border px-27px;

    span {
      @apply p-3px cursor-pointer;

      &:hover {
        background-color: v-bind('token.colorPrimary');
        color: v-bind('token.colorWhite');
      }
    }
  }

  &__footer {
    border-top: 1px solid v-bind('token.colorBorder');
    @apply h-30px flex items-center justify-between box-border px-50px;

    span {
      @apply p-3px cursor-pointer;

      &:hover {
        background-color: v-bind('token.colorPrimary');
        color: v-bind('token.colorWhite');
      }
    }

    .--icon {
      background-color: v-bind('token.colorPrimary');
      color: v-bind('token.colorText')-inverse;
    }
  }

  &__header {
    background-color: v-bind('token.colorBgLayout');
    @apply h-30px flex items-center justify-between box-border px-10px;

    span {
      @apply text-16px ml-5px cursor-pointer;

      &:hover {
        color: v-bind('token.colorPrimary');
      }

      &.--active {
        color: v-bind('token.colorPrimary');
      }
    }
  }

  &__box {
    li {
      @apply overflow-hidden;
    }

    &-submenu li {
      @apply pointer-events-none pl-16px;
    }

    &-item {
      @apply relative w-full pl-8px pr-6px flex items-center z-1;

      &:hover {
        background-color: v-bind('token.colorBgTextHover');
      }
    }

    .--active {
      color: v-bind('token.colorWhite');
      background-color: v-bind('token.colorPrimary');
    }

    .--item {
      @apply h-32px leading-32px flex items-center;

      b {
        @apply ml-5px font-normal;
      }
    }

    .--thumbail {
      @apply h-48px leading-48px;

      img {
        border: 1px solid v-bind('token.colorBorder');
        background-color: v-bind('token.colorInfoBg');
        @apply w-51px h-34px;
      }

      b {
        @apply ml-5px font-normal;
      }
    }

    .--animated {
      transition: transform 0.3s v-bind('token.motionEaseInOut');
    }

    .--icon {
      @apply absolute right-5px top-5px;
    }
  }
}

.toggle-enter-active,
.toggle-leave-active {
  transition: transform 0.3s v-bind('token.motionEaseInOut');
}

.toggle-enter-from,
.toggle-leave-to {
  transform: translateY(-100%);
}
</style>

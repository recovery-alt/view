<template>
  <div ref="layerRef" class="layer-panel" :class="{ '--hide': !panel.layer }">
    <header class="layer-panel__header">
      <div>{{ t('layer') }}</div>
      <section>
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
    <section class="layer-panel__wrapper">
      <header class="layer-panel__toolbar">
        <Tooltip
          v-for="item in moveActions"
          :key="item.icon.name"
          placement="bottom"
          :title="item.tip"
        >
          <component
            :is="item.icon"
            :class="{ '--disable': reverseBoard.selected.length === 0 }"
            @click="item.event"
          />
        </Tooltip>
      </header>
      <ul v-if="reverseBoard.data.length" class="layer-panel__box">
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
      <Empty v-else :description="t('tip')" />
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
          :class="{ '--disable': operationActions[i]?.disable }"
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
import { Empty, Tooltip } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { layerPanel as messages } from '@/locales';
import { useFooter, useMode, useReverse, useToggle, useToolBar } from './hook';
import { getImgSrc } from '@/gallery';

const board = useBoardStore();
const panel = usePanelStore();
const menu = useMenuStore();
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
  position: relative;
  width: 200px;
  height: 100%;
  border-right: 1px solid @border-color-base;
  transition: width 0.3s @ease-in-out;
  z-index: 4;
  overflow: hidden;
  white-space: nowrap;
  background-color: @component-background;

  .ant-empty {
    margin-top: 20px;
  }

  .--disable {
    opacity: 0.3;
  }

  &.--hide {
    width: 0;
    border: 0;
  }

  &__header {
    height: 30px;
    background-color: @layout-body-background;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;

    section {
      display: flex;
    }

    span {
      margin-left: 5px;
      cursor: pointer;
      font-size: 16px;

      &:hover {
        color: @primary-color;
      }

      &.--active {
        color: @primary-color;
      }
    }
  }

  &__wrapper {
    height: calc(100% - 60px);
  }

  &__toolbar {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 27px;
    border-bottom: 1px solid @border-color-base;
    background-color: @component-background;

    span {
      padding: 3px;
      cursor: pointer;

      &:hover {
        background-color: @primary-color;
        color: @white;
      }
    }
  }

  &__box {
    height: calc(100% - 30px);
    overflow-x: hidden;
    overflow-y: auto;

    li {
      overflow: hidden;
    }

    &-submenu li {
      pointer-events: none;
      padding-left: 16px;
    }

    &-item {
      position: relative;
      width: 100%;
      padding-left: 8px;
      padding-right: 6px;
      display: flex;
      align-items: center;
      z-index: 1;

      &:hover {
        background-color: @item-hover-bg;
      }
    }

    .--active {
      color: @white;
      background-color: @primary-color;
    }

    .--item {
      line-height: 32px;
      height: 32px;
      display: flex;
      align-items: center;

      b {
        margin-left: 5px;
        font-weight: normal;
      }
    }

    .--thumbail {
      height: 48px;
      line-height: 48px;

      img {
        width: 51px;
        height: 34px;
        border: 1px solid @border-color-base;
        background-color: @body-background;
      }

      b {
        margin-left: 5px;
        font-weight: normal;
      }
    }

    .--animated {
      transition: transform 0.3s @ease-in-out;
    }

    .--icon {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }

  &__footer {
    height: 30px;
    border-top: 1px solid @border-color-base;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 50px;

    span {
      padding: 3px;
      cursor: pointer;

      &:hover {
        background-color: @primary-color;
        color: @white;
      }
    }

    .--icon {
      background-color: @primary-color;
      color: @text-color-inverse;
    }
  }
}

.toggle-enter-active,
.toggle-leave-active {
  transition: transform 0.3s @ease-in-out;
}

.toggle-enter-from,
.toggle-leave-to {
  transform: translateY(-100%);
}
</style>

<template>
  <div class="layer-panel" :class="{ 'layer-panel--hide': !panel.layer }">
    <template v-if="panel.layer">
      <header class="layer-panel__header">
        <div>图层</div>
        <section>
          <component
            :is="item"
            v-for="(item, i) in ['AppstoreOutlined', 'DatabaseOutlined']"
            :key="item"
            :class="{ active: i === 0 ? !showlist : showlist }"
            @click="switchList(i)"
          />
          <LeftOutlined @click="panel.layer = !panel.layer" />
        </section>
      </header>
      <section class="layer-panel__wrapper">
        <header class="layer-panel__toolbar">
          <a-tooltip v-for="item in moveActions" :key="item.icon" placement="bottom">
            <template #title>{{ item.tip }}</template>
            <component :is="item.icon" />
          </a-tooltip>
        </header>
        <ul class="layer-panel__box">
          <li
            v-for="(item, index) in board.data"
            :key="item.id"
            :class="{
              active: board.selected.includes(index),
              'layer-panel__box--thumbail': !showlist,
              'layer-panel__box--item': showlist,
            }"
            @click="e => changeSelected(e, index)"
          >
            <DatabaseOutlined v-if="showlist" />
            <img v-else src="//img.alicdn.com/tfs/TB1tVMSk1bviK0jSZFNXXaApXXa-368-208.png" />
            <div>{{ item.label }}</div>
          </li>
        </ul>
      </section>
      <footer class="layer-panel__footer">
        <component :is="item.icon" v-for="item in operations" :key="item.icon" />
      </footer>
    </template>
  </div>
</template>

<script lang="ts">
import {
  AppstoreOutlined,
  DatabaseOutlined,
  LeftOutlined,
  FolderOutlined,
  DeleteOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons-vue';
import { panel } from '@/hooks';
import { ref } from 'vue';
import { BoardEnum, useStore } from '@/store';

export default {
  components: {
    AppstoreOutlined,
    DatabaseOutlined,
    LeftOutlined,
    FolderOutlined,
    DeleteOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
  },
  setup() {
    const store = useStore();

    const showlist = ref(false);

    const { board } = store.state;
    const moveActions = [
      { tip: '置顶', icon: 'VerticalAlignTopOutlined' },
      { tip: '置底', icon: 'VerticalAlignBottomOutlined' },
      { tip: '上移', icon: 'ArrowUpOutlined' },
      { tip: '下移', icon: 'ArrowDownOutlined' },
    ];

    const operations = [
      { tip: '成组', icon: 'FolderOutlined' },
      { tip: '删除', icon: 'DeleteOutlined' },
      { tip: '锁定', icon: 'LockOutlined' },
      { tip: '隐藏', icon: 'EyeInvisibleOutlined' },
    ];

    const changeSelected = (e: MouseEvent, index: number) => {
      if (e.ctrlKey || e.metaKey) {
        store.dispatch(BoardEnum.CHANGE_SELECTED, index);
      } else {
        store.dispatch(BoardEnum.SET_INDEX, index);
      }
    };

    const switchList = (index: number) => {
      if ((index === 0 && showlist.value) || (index === 1 && !showlist.value)) {
        showlist.value = !showlist.value;
      }
    };

    return { panel, showlist, changeSelected, board, switchList, moveActions, operations };
  },
};
</script>

<style lang="less">
.layer-panel {
  width: 200px;
  height: 100%;
  border-right: 1px solid var(--border-color-base);
  transition: width 0.3s var(--ease-in-out);
  z-index: 4;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;

  &--hide {
    width: 0;
    border: 0;
  }

  &__header {
    height: 30px;
    background-color: var(--normal-color);
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

      &.active {
        color: var(--primary-8);
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
    border-bottom: 1px solid var(--border-color-base);
    background-color: var(--component-background);

    span {
      padding: 3px;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-8);
        color: var(--component-background);
      }
    }
  }

  &__box {
    li {
      width: 100%;
      padding-left: 8px;
      padding-right: 6px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-8);
      }

      &.active {
        background-color: var(--primary-1);
      }
    }

    &--item {
      height: 32px;
      display: flex;
      align-items: center;

      div {
        margin-left: 5px;
      }
    }

    &--thumbail {
      height: 48px;

      img {
        width: 51px;
        height: 34px;
        border: 1px solid #3a4659;
      }

      div {
        margin-left: 5px;
      }
    }
  }

  &__footer {
    height: 30px;
    border-top: 1px solid var(--border-color-base);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 50px;

    span {
      padding: 3px;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-8);
        color: var(--component-background);
      }
    }
  }
}
</style>

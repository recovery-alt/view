<template>
  <header class="header">
    <div class="logo-box">
      <img width="40" height="40" src="/src/assets/img/logo.svg" />
    </div>
    <div>
      <a-tooltip v-for="item in buttonGroup" :key="item.name" placement="bottom" :title="item.name">
        <component :is="item.icon" class="header-icon" @click="item.event" />
      </a-tooltip>
    </div>
    <div class="header-size">
      页面尺寸：
      <div class="header-input">
        <a-input v-model:value="headSize.width" size="small" />
      </div>
      <div class="header-x">x</div>
      <div class="header-input">
        <a-input v-model:value="headSize.height" size="small" />
      </div>
    </div>
  </header>
  <main class="main">
    <left-panel />
    <section class="main-mid">
      <div class="mid-box">
        <board :style="patchUnit(headSize)" />
      </div>
    </section>
    <right-panel />
  </main>
  <board-preview v-model="modalOpen" />
</template>

<script lang="ts">
import LeftPanel from '@/components/left-panel';
import Board, { BoardPreview } from '@/components/board';
import { SnapshotEnum } from '@/store/modules/snapshot';
import { patchUnit } from '@/utils';
import { BoardEnum } from '@/store/modules/board';
import RightPanel from '@/components/right-panel';
import { useStore } from '@/store';
import { loadPage, savePage, headSize } from '@/hooks';
import { ref } from 'vue';
import {
  LeftOutlined,
  RightOutlined,
  ScissorOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'editor',
  components: {
    LeftPanel,
    Board,
    RightPanel,
    BoardPreview,
    LeftOutlined,
    RightOutlined,
    ScissorOutlined,
    CopyOutlined,
    DeleteOutlined,
    FileDoneOutlined,
    PlaySquareOutlined,
  },
  props: { id: { type: String, default: () => '' } },
  setup(props) {
    const store = useStore();
    const undo = () => store.dispatch(SnapshotEnum.UNDO);
    const redo = () => store.dispatch(SnapshotEnum.REDO);
    const cut = () => store.dispatch(BoardEnum.CUT);
    const copy = () => store.dispatch(BoardEnum.COPY);
    const del = () => store.dispatch(BoardEnum.DEL);

    const modalOpen = ref(false);

    const buttonGroup = [
      { name: '上一步', icon: 'left-outlined', event: undo },
      { name: '下一步', icon: 'right-outlined', event: redo },
      { name: '剪切', icon: 'scissor-outlined', event: cut },
      { name: '复制', icon: 'copy-outlined', event: copy },
      { name: '删除', icon: 'delete-outlined', event: del },
      {
        name: '保存',
        icon: 'file-done-outlined',
        event: () => savePage(store),
      },
      {
        name: '预览',
        icon: 'play-square-outlined',
        event: () => {
          modalOpen.value = true;
        },
      },
    ];

    loadPage(store, props.id);

    return { headSize, patchUnit, buttonGroup, modalOpen };
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 48px;
  border-bottom: 1px solid @border-color-base;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;

  &-size {
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  &-input {
    width: 65px;
  }

  &-x {
    padding: 0 10px;
  }

  &-icon {
    font-size: 20px;
    margin-left: 20px;
    color: @primary-8;
    &:hover {
      color: @success-color;
    }
  }
}

.main {
  height: calc(100% - 60px);
  display: flex;

  &-mid {
    flex: 1;
    height: 100%;
    background-color: @descriptions-bg;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
  }
}

.mid-box {
  height: 100%;
  overflow: auto;
}

.logo {
  margin-left: 5px;
  font-size: 20px;
  color: @primary-8;
  font-weight: bold;

  &-box {
    display: flex;
    align-items: center;
  }
}
</style>

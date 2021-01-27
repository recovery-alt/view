<template>
  <header class="header">
    <el-button-group>
      <el-button
        size="small"
        v-for="item in buttonGroup"
        :key="item.name"
        :icon="item.icon"
        @click="item.event"
        >{{ item.name }}
      </el-button>
    </el-button-group>
    <div class="header-size">
      页面尺寸：
      <div class="header-input">
        <el-input v-model="headSize.width" size="small" />
      </div>
      <div class="header-x">x</div>
      <div class="header-input">
        <el-input v-model="headSize.height" size="small" />
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LeftPanel from '@/components/left-panel';
import Board from '@/components/board';
import { headSize } from '@/hooks';
import { SnapshotEnum } from '@/store/modules/snapshot';
import { patchUnit } from '@/utils';
import { BoardEnum } from '@/store/modules/board';
import RightPanel from '@/components/right-panel';
import { useStore } from '@/store';

const components = { LeftPanel, Board, RightPanel };

const setup = () => {
  const store = useStore();
  const undo = () => store.dispatch(SnapshotEnum.UNDO);
  const redo = () => store.dispatch(SnapshotEnum.REDO);
  const cut = () => store.dispatch(BoardEnum.CUT);
  const copy = () => store.dispatch(BoardEnum.COPY);
  const del = () => store.dispatch(BoardEnum.DEL);

  const buttonGroup = [
    { name: '上一步', icon: 'el-icon-back', event: undo },
    { name: '下一步', icon: 'el-icon-right', event: redo },
    { name: '剪切', icon: 'el-icon-scissors', event: cut },
    { name: '复制', icon: 'el-icon-document-copy', event: copy },
    { name: '删除', icon: 'el-icon-delete', event: del },
  ];

  return { headSize, patchUnit, buttonGroup };
};

export default defineComponent({ components, setup });
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  border-bottom: 1px solid $el-border-1;
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
}

.main {
  height: calc(100% - 60px);
  display: flex;

  &-mid {
    flex: 1;
    height: 100%;
    background-color: $el-info-3;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
  }
}

.mid-box {
  height: 100%;
  overflow: auto;
}
</style>

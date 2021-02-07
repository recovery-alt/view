<template>
  <header class="header">
    <div class="logo-box">
      <img width="40" height="40" src="../assets/img/logo.svg" />
    </div>
    <div>
      <el-tooltip
        placement="bottom"
        v-for="item in buttonGroup"
        :key="item.name"
        :content="item.name"
      >
        <i class="header-icon" :class="item.icon" @click="item.event"></i>
      </el-tooltip>
    </div>
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
import { ElMessage } from 'element-plus';

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
    {
      name: '保存',
      icon: 'el-icon-document-checked',
      event: () => {
        // TODO: 保存功能
        ElMessage.warning('开发中...');
      },
    },
    {
      name: '预览',
      icon: 'el-icon-view',
      event: () => {
        // TODO: 预览
        ElMessage.warning('开发中...');
      },
    },
  ];

  return { headSize, patchUnit, buttonGroup };
};

export default defineComponent({ components, setup });
</script>

<style lang="scss" scoped>
.header {
  height: 48px;
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

  &-icon {
    font-size: 20px;
    margin-left: 20px;
    color: $el-primary-1;
    &:hover {
      color: $el-success-1;
    }
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

.logo {
  margin-left: 5px;
  font-size: 20px;
  color: $el-primary-1;
  font-weight: bold;

  &-box {
    display: flex;
    align-items: center;
  }
}
</style>

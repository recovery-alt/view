<template>
  <header class="header">
    <el-button size="small" @click="undo">撤销</el-button>
    <el-button size="small" @click="redo">重做</el-button>
    <el-button size="small" @click="del">删除</el-button>
    <div class="header-input">
      <el-input v-model="headSize.width" size="small" />
    </div>
    <span class="header-x">x</span>
    <div class="header-input">
      <el-input v-model="headSize.height" size="small" />
    </div>
  </header>
  <main class="main">
    <component-list />
    <section class="main-mid">
      <div class="mid-box">
        <board :style="patchUnit(headSize)" />
      </div>
    </section>
    <section class="main-right">
      <el-tabs v-model="activeName">
        <el-tab-pane label="样式" name="first">
          <attr-panel></attr-panel>
        </el-tab-pane>
        <el-tab-pane label="动画" name="second">动画</el-tab-pane>
      </el-tabs>
    </section>
  </main>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ComponentList from '@/components/component-list';
import Board from '@/components/board';
import { headSize } from '@/hooks';
import { useStore } from '@/store';
import { SnapshotEnum } from '@/store/modules/snapshot';
import AttrPanel from '@/components/attr-panel';
import { patchUnit } from '@/utils';
import { BoardEnum } from '@/store/modules/board';

const components = { ComponentList, Board, AttrPanel };

const setup = () => {
  const store = useStore();
  const undo = () => store.dispatch(SnapshotEnum.UNDO);
  const redo = () => store.dispatch(SnapshotEnum.REDO);
  const del = () => store.dispatch(BoardEnum.DEL);

  const activeName = ref('first');

  return { headSize, undo, redo, activeName, patchUnit, del };
};

export default defineComponent({
  components,
  setup,
});
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  border-bottom: 1px solid $el-border-1;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  &-input {
    width: 65px;
  }

  &-x {
    padding: 0 5px;
  }
}

.main {
  height: calc(100% - 60px);
  display: flex;

  &-mid {
    flex: 1;
    flex-shrink: 0;
    height: 100%;
    background-color: $el-info-3;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
  }

  &-right {
    width: 300px;
    border-left: 1px solid $el-border-1;
    box-sizing: border-box;
    padding: 5px 10px;
  }
}

.mid-box {
  height: 100%;
  overflow: auto;
}
</style>

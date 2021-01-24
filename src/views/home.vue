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
    <component-list />
    <section class="main-mid">
      <div class="mid-box">
        <board :style="patchUnit(headSize)" />
      </div>
    </section>
    <section class="main-right">
      <el-tabs v-model="activeName">
        <el-tab-pane label="样式" name="style">
          <attr-panel />
        </el-tab-pane>
        <el-tab-pane label="动画" name="animation">
          <template v-if="curComponent">
            <el-button @click="drawer.show = true">添加</el-button>
            <el-button>预览</el-button>
          </template>
        </el-tab-pane>
      </el-tabs>
    </section>
    <el-drawer v-model="drawer.show" direction="rtl">
      <el-tabs v-model="drawer.selected">
        <el-tab-pane
          v-for="item in drawer.data"
          :key="item.title"
          :label="item.title"
          :name="item.title"
        >
          <div class="animate-box">
            <div
              v-for="animation in item.data"
              :class="getAnimationClass(animation.name)"
              :key="animation.name"
              @mouseover="handleMouseover(animation.name)"
            >
              {{ animation.label }}
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </main>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import ComponentList from '@/components/component-list';
import Board from '@/components/board';
import { headSize, useAnimation } from '@/hooks';
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
  const cut = () => store.dispatch(BoardEnum.CUT);
  const copy = () => store.dispatch(BoardEnum.COPY);
  const del = () => store.dispatch(BoardEnum.DEL);

  const { board } = store.state;
  // 当前选中组件
  const curComponent = computed(() => {
    return board.selected.length === 1 ? board.data[board.selected[0]] : null;
  });

  const activeName = ref('style');

  const buttonGroup = [
    { name: '上一步', icon: 'el-icon-back', event: undo },
    { name: '下一步', icon: 'el-icon-right', event: redo },
    { name: '剪切', icon: 'el-icon-scissors', event: cut },
    { name: '复制', icon: 'el-icon-document-copy', event: copy },
    { name: '删除', icon: 'el-icon-delete', event: del },
  ];

  const { animations, drawer, handleMouseover, getAnimationClass } = useAnimation();

  return {
    curComponent,
    headSize,
    undo,
    redo,
    activeName,
    patchUnit,
    del,
    buttonGroup,
    animations,
    drawer,
    handleMouseover,
    getAnimationClass,
  };
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

.animate {
  &-box {
    display: flex;
    flex-wrap: wrap;
  }

  &-block {
    width: 120px;
    height: 60px;
    background-color: $el-info-3;
    margin-left: 20px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

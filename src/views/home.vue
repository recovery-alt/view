<template>
  <header class="header">
    <el-button @click="undo">撤销</el-button>
    <el-button @click="redo">重做</el-button>
    <el-input v-model="width" size="small" />
    <el-input v-model="height" size="small" />
  </header>
  <main class="main">
    <component-list />
    <section class="main-mid">
      <div class="mid-box">
        <board :style="headStyle" />
      </div>
    </section>
    <section class="main-right"></section>
  </main>
</template>

<script>
import { computed, defineComponent, ref, toRefs } from 'vue';
import ComponentList from '@/components/component-list';
import Board from '@/components/board';
import { headSize, headStyle } from '@/hooks';
import { useStore } from 'vuex';
import { SnapshotEnum } from '@/store/modules/snapshot';

const setup = () => {
  const store = useStore();
  const undo = () => store.dispatch(SnapshotEnum.UNDO);
  const redo = () => store.dispatch(SnapshotEnum.REDO);

  return { ...toRefs(headSize), headStyle, undo, redo };
};

export default defineComponent({
  setup,
  components: { ComponentList, Board },
});
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  border-bottom: 1px solid $el-border-1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
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
    width: 260px;
    border-left: 1px solid $el-border-1;
  }
}

.mid-box {
  height: 100%;
  overflow: auto;
}
</style>

<template>
  <section class="main-right">
    <el-tabs v-model="activeName" v-if="curComponent">
      <el-tab-pane label="样式" name="style">
        <attr-panel />
      </el-tab-pane>
      <el-tab-pane label="动画" name="animation">
        <div class="animation-btn_group">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="drawer.show = true">
            添加
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-video-play"
            @click="previewAnimation(curComponent, board.selected[0])"
          >
            预览
          </el-button>
        </div>
        <animate-panel />
      </el-tab-pane>
    </el-tabs>
    <el-empty v-else description="请选中你的组件" />
    <div class="main-right_fold" @click="toggle">
      <i :class="`el-icon-d-arrow-${isFold ? 'left' : 'right'}`"></i>
    </div>
  </section>
  <el-drawer v-model="drawer.show" direction="rtl">
    <el-tabs v-model="drawer.selected">
      <el-tab-pane
        v-for="item in drawer.data"
        :key="item.title"
        :label="item.title"
        :name="item.title"
      >
        <ul class="animation-box">
          <li
            class="animation-box_item"
            v-for="animation in item.data"
            :key="animation.name"
            @mouseover="handleMouseover(animation.name)"
            @mouseleave="handleMouseleave"
            @click="addAnimation(animation.name)"
          >
            <div :class="getAnimationClass(animation.name)" />
            {{ animation.label }}
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import AttrPanel from './attr-panel.vue';
import { useAnimation } from '@/hooks';
import { useStore } from '@/store';
import AnimatePanel from './animate-panel.vue';

export default defineComponent({
  components: { AttrPanel, AnimatePanel },
  setup() {
    const store = useStore();
    const { board } = store.state;

    // 当前选中组件
    const curComponent = computed(() => {
      return board.selected.length === 1 ? board.data[board.selected[0]] : null;
    });

    const activeName = ref('style');
    const animation = useAnimation(store);

    const isFold = ref(false);

    const toggle = () => {
      isFold.value = !isFold.value;
    };

    const width = computed(() => (isFold.value ? '0' : '300px'));

    return { board, curComponent, activeName, isFold, toggle, width, ...animation };
  },
});
</script>

<style lang="scss" scoped>
.main-right {
  position: relative;
  width: v-bind(width);
  border-left: 1px solid $el-border-1;
  box-sizing: border-box;
  padding: 5px 0;
  box-shadow: $el-shadow-3;
  transition: all 0.3s ease-in-out;

  &_fold {
    position: absolute;
    top: 50%;
    left: -20px;
    width: 20px;
    height: 100px;
    margin-top: -50px;
    box-shadow: $el-shadow-3;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #fff;
    font-size: 18px;
  }
}

.animation {
  &-box {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    &_item {
      width: 120px;
      margin-left: 20px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      div {
        display: block;
        content: '';
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 40px solid $el-primary-1;
        margin-bottom: 10px;
      }
    }
  }

  &-list {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      margin-top: 10px;
    }
  }

  &-btn_group {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

:deep {
  .el-tabs {
    margin: 5px 10px;
  }
}
</style>

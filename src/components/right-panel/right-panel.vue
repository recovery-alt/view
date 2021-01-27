<template>
  <section class="main-right">
    <el-tabs v-model="activeName">
      <el-tab-pane label="样式" name="style">
        <attr-panel />
      </el-tab-pane>
      <el-tab-pane label="动画" name="animation">
        <template v-if="curComponent">
          <el-button @click="drawer.show = true">添加</el-button>
          <el-button @click="previewAnimation(curComponent, board.selected[0])">预览</el-button>
          <ul class="animation-list">
            <li v-for="item in curComponent.animations" :key="item">{{ item }}</li>
          </ul>
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
        <div class="animation-box">
          <div
            v-for="animation in item.data"
            :key="animation.name"
            :class="getAnimationClass(animation.name)"
            @mouseover="handleMouseover(animation.name)"
            @mouseleave="handleMouseleave"
            @click="addAnimation(animation.name)"
          >
            {{ animation.label }}
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import AttrPanel from './attr-panel.vue';
import { useAnimation } from '@/hooks';
import { useStore } from '@/store';

export default defineComponent({
  components: { AttrPanel },
  setup() {
    const store = useStore();
    const { board } = store.state;

    // 当前选中组件
    const curComponent = computed(() => {
      return board.selected.length === 1 ? board.data[board.selected[0]] : null;
    });

    const activeName = ref('style');
    const animation = useAnimation(store);

    return { board, curComponent, activeName, ...animation };
  },
});
</script>

<style lang="scss" scoped>
.main-right {
  flex-basis: 300px;
  flex-shrink: 0;
  border-left: 1px solid $el-border-1;
  box-sizing: border-box;
  padding: 5px 10px;
}

.animation {
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

<template>
  <el-collapse
    v-if="curComponent.animations && curComponent.animations.length > 0"
    v-model="active"
  >
    <el-collapse-item
      v-for="animation in curComponent.animations"
      :key="animation"
      :name="animation"
    >
      <template #title>
        <div class="animation-title">
          <span>{{ animation }}</span>
          <div>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-video-play"
              @click.stop="preview(animation)"
            />
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-delete"
              @click.stop="del(animation)"
            />
          </div>
        </div>
      </template>
    </el-collapse-item>
  </el-collapse>
  <el-empty v-else description="尚未选择任何动画" />
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from '@/store';
import { useAnimation, useBoardRefs } from '@/hooks';

export default {
  name: 'animate-panel',
  setup() {
    const active = ref('');

    const store = useStore();
    const { board } = store.state;

    // 当前选中组件
    const curComponent = computed(() => {
      return board.selected.length === 1 ? board.data[board.selected[0]] : null;
    });

    const { play } = useAnimation();

    const preview = (name: string) => {
      const { boardRefs } = useBoardRefs();
      const ref = boardRefs[board.selected[0]];
      play(name, ref);
    };

    const del = (animation: string) => {
      if (!curComponent.value || !curComponent.value.animations) return;
      const index = curComponent.value.animations.findIndex(val => val === animation);
      curComponent.value.animations.splice(index, 1);
    };

    return { active, curComponent, preview, board, del };
  },
};
</script>

<style lang="scss" scoped>
.animation-title {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>

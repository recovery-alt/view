<template>
  <a-collapse v-if="curComponent.animations && curComponent.animations.length > 0" v-model="active">
    <a-collapse-panel v-for="animation in curComponent.animations" :key="animation">
      <template #header>
        <div class="animation-title">
          <span>{{ animation }}</span>
          <div class="animation-title_right">
            <a-button size="small" type="primary" @click.stop="preview(animation)">
              <template #icon><play-circle-outlined /></template>
            </a-button>
            <a-button size="small" type="primary" @click.stop="del(animation)">
              <template #icon><delete-outlined /></template>
            </a-button>
          </div>
        </div>
      </template>
    </a-collapse-panel>
  </a-collapse>
  <a-empty v-else description="尚未选择任何动画" />
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from '@/store';
import { useAnimation, useBoardRefs } from '@/hooks';
import { PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';

export default {
  name: 'animate-panel',
  components: { PlayCircleOutlined, DeleteOutlined },
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

<style lang="less" scoped>
.animation-title {
  width: 100%;
  display: flex;
  justify-content: space-around;

  &_right button:first-child {
    margin-right: 10px;
  }
}
</style>

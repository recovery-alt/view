<template>
  <div class="board">
    <component
      v-for="item in componentData"
      :key="item.component"
      :is="item.component"
      :style="item.style"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

const setup = () => {
  const componentData = ref<Component[]>([
    {
      component: 'v-text',
      style: {
        width: '100px',
        height: '100px',
      },
    },
    {
      component: 'v-button',
      style: {
        width: '100px',
        height: '100px',
      },
    },
  ]);
  return { componentData };
};

export default defineComponent({ setup });
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  background-color: #fff;
  overflow: auto;
}
</style>

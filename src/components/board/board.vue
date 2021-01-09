<template>
  <div class="board" @drop="handleDrop" @dragover="handleDragOver">
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
  const componentData = ref<Component[]>([]);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer?.getData('index');
    componentData.value.push({ component: `v-${type}` });
  };
  const handleDragOver = (e: Event) => {
    e.preventDefault();
  };
  return { componentData, handleDragOver, handleDrop };
};

export default defineComponent({ setup });
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  background-color: #fff;
  overflow: auto;

  & > * {
    position: absolute;
  }
}
</style>

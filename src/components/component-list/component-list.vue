<template>
  <section class="main-left" @dragstart="handleDragStart">
    <button
      draggable="true"
      v-for="item in list"
      :key="item.type"
      type="primary"
      :data-type="item.type"
    >
      {{ item.text }}
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

const setup = () => {
  const list = ref([
    { type: 'text', text: '文本' },
    { type: 'button', text: '按钮' },
  ]);
  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLDataListElement;
    if (target.dataset.type) {
      e.dataTransfer?.setData('type', target.dataset.type);
    }
    e.dataTransfer?.setData('offsetX', e.offsetX + '');
    e.dataTransfer?.setData('offsetY', e.offsetY + '');
  };
  return { list, handleDragStart };
};

export default defineComponent({ setup });
</script>

<style lang="scss" scoped>
.main-left {
  width: 200px;
  box-sizing: border-box;
  padding: 15px;
  border-right: 1px solid $el-border-1;
}
</style>

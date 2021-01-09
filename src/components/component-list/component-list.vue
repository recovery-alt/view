<template>
  <section class="main-left" @dragstart="handleDragStart">
    <button
      draggable="true"
      v-for="item in list"
      :key="item.type"
      type="primary"
      :data-index="item.type"
    >
      {{ item.text }}
    </button>
  </section>
</template>

<script>
import { defineComponent, ref } from 'vue';

const setup = () => {
  const list = ref([
    { type: 'text', text: '文本' },
    { type: 'button', text: '按钮' },
  ]);
  const handleDragStart = e => {
    e.dataTransfer.setData('index', e.target.dataset.index);
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
  border-right: 1px solid #eee;
}
</style>

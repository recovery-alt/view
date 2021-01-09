<template>
  <section class="main-left">
    <el-button v-for="item in list" :key="item" type="primary">{{ item }}</el-button>
  </section>
</template>

<script>
import { defineComponent, ref } from 'vue';

const setup = () => {
  const list = ref(['文本', '按钮']);
  return { list };
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

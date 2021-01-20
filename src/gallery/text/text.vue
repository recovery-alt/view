<template>
  <div class="text">aaaa</div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    const value = ref('');
    return { value };
  },
};
</script>

<style lang="scss" scoped>
.text {
  height: 100%;
  border: 1px solid $el-border-2;
}
</style>

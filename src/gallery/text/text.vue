<template>
  <div><input v-model="value" /></div>
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

<style></style>

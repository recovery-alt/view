<template>
  <div class="board-markline"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const name = 'board-markline';

const setup = () => {
  console.log('setup');
};

export default defineComponent({ name, setup });
</script>

<style lang="scss" scoped>
.board-markline {
  position: absolute;
}
</style>

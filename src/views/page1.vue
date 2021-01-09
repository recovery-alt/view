<template>
  <div>{{ count }}</div>
  <button @click="plus">click</button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

const setup = () => {
  const store = useStore();
  const count = computed(() => store.state.user.count);
  const plus = () => store.commit('user/plus');
  return { count, plus };
};

export default defineComponent({ setup });
</script>

<style></style>

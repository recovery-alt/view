<template>
  <div>{{ data }}</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getUser } from '@/api';

export default defineComponent({
  name: 'login',
  setup() {
    const data = ref<Array<unknown> | null>(null);

    onMounted(async () => {
      const res = await getUser<Array<{ name: string; password: string }>>();
      data.value = res.data;
    });

    return { data };
  },
});
</script>

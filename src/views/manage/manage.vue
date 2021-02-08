<template>
  <div>
    <button v-for="item in pages" :key="item._id" @click="toEdit(item._id)">
      {{ item.title }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getPages } from '@/api';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    /* eslint-disable no-undef */
    const pages = ref<Array<Page>>([]);

    const router = useRouter();

    onMounted(async () => {
      /* eslint-disable no-undef */
      const res = await getPages<Array<Page>>();
      pages.value = res.data;
    });

    const toEdit = (id: string) => {
      router.push({ path: `/board/${id}`, params: { id } });
    };

    return { pages, toEdit };
  },
});
</script>

<style></style>

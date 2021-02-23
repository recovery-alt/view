<template>
  <div>
    <button v-for="item in pages" :key="item._id" @click="toEdit(item._id)">
      {{ item.title }}
    </button>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useManage } from '@/hooks';

export default {
  name: 'manage',
  setup() {
    const { pages } = useManage();
    const router = useRouter();

    const toEdit = (id: string) => {
      router.push({ path: `/editor/${id}`, params: { id } });
    };

    return { pages, toEdit };
  },
};
</script>

import { getPages } from '@/api';
import { onMounted, ref } from 'vue';

export const useManage = () => {
  const pages = ref<Array<Page>>([]);

  onMounted(async () => {
    const res = await getPages<Array<Page>>();
    pages.value = res.data;
  });

  return { pages };
};

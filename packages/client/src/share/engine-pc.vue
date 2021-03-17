<template>
  <board-wrapper :data="data" />
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { getPage } from '@/api';
import { patchUnit } from '@/utils';
import { BoardWrapper } from '@/components';

export default {
  name: 'render',
  components: { BoardWrapper },
  props: {
    id: { type: String, default: () => '' },
  },
  setup(props) {
    const data = ref([]);

    onMounted(async () => {
      if (!props.id) return;
      const res = await getPage<Page>(props.id);
      document.title = res.data.title;
      data.value = res.data.config;
      document.body.style.width = res.data.width + 'px';
      document.body.style.height = res.data.height + 'px';
    });

    return { data, patchUnit };
  },
};
</script>

<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

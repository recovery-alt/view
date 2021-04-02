<template>
  <div
    v-for="(item, index) in data"
    :key="item.id"
    class="board-wrapper"
    :z-index="index"
    :style="splitStyleAndPatch(item.style)"
  >
    <component
      :is="item.component"
      class="board-component"
      :group="item.group"
      :style="splitStyleAndPatch(item.style, false)"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps } from 'vue';
import { getPage } from '@/api';
import { splitStyleAndPatch } from '@/utils';

const props = defineProps({ id: { type: String, default: () => '' } });

const data = ref<Component[]>([]);

onMounted(async () => {
  if (!props.id) return;
  const res = await getPage<Page>(props.id);
  document.title = res.data.title;
  data.value = res.data.config;
  document.body.style.width = res.data.width + 'px';
  document.body.style.height = res.data.height + 'px';
});
</script>

<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100%;
}

.board-wrapper {
  position: absolute;
  box-sizing: border-box;

  & > *:first-child {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .board-component {
    height: 100%;
  }
}
</style>

<template>
  <component
    :is="data.component"
    class="board-component"
    :group="data.group"
    :data="data.dataset"
    :props-data="data.propsData"
    :style="splitStyleAndPatch(data.style, false)"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { splitStyleAndPatch } from '@/utils';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<Component>,
      default: () => ({}),
    },
    withClass: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    return { splitStyleAndPatch };
  },
});
</script>

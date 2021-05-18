<template>
  <component
    :is="`cq-${data.component}`"
    :group="data.group"
    :data="data.data"
    :props-data="data.propsData"
    :style="patchAll ? patchUnit(data.style) : splitStyleAndPatch(data.style, false)"
  />
</template>

<script lang="ts">
import type { Component } from '@/typings';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { splitStyleAndPatch, patchUnit } from '@/utils';

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
    patchAll: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    return { splitStyleAndPatch, patchUnit };
  },
});
</script>

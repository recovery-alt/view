<template>
  <component
    :is="`cq-${data.component}`"
    ref="box"
    :group="data.group"
    :data="data.data"
    :props-data="data.propsData"
    :style="patchAll ? patchUnit(data.style) : splitStyleAndPatch(data.style, false)"
  />
</template>

<script lang="ts">
import type { Component } from '@/typings';
import type { PropType, ComponentPublicInstance } from 'vue';
import { computed, onMounted, defineComponent, shallowRef } from 'vue';
import { playAnimations, splitStyleAndPatch, patchUnit } from '@/utils';

export default defineComponent({
  name: 'board-box',
  props: {
    data: {
      type: Object as PropType<Component>,
      default: () => ({}),
    },
    patchAll: {
      type: Boolean,
      default: false,
    },
    editorMode: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const box = shallowRef<ComponentPublicInstance>();

    const curCom = computed(() => props.data);

    onMounted(() => {
      const { animations } = curCom.value;
      if (props.editorMode || !animations || !box.value?.$el) return;

      playAnimations(box.value.$el, curCom.value.animations);
    });
    return { splitStyleAndPatch, patchUnit, box };
  },
});
</script>

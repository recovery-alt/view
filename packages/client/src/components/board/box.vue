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

<script lang="ts" setup>
import type { Component } from '@/typings';
import type { PropType, ComponentPublicInstance } from 'vue';
import { computed, onMounted, shallowRef } from 'vue';
import { playAnimations } from '@/utils/animation';
import { splitStyleAndPatch, patchUnit } from '@/utils/style';

const props = defineProps({
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
});

const box = shallowRef<ComponentPublicInstance>();
const curCom = computed(() => props.data);

onMounted(() => {
  const { animations } = curCom.value;
  if (props.editorMode || !animations || !box.value?.$el) return;

  playAnimations(box.value.$el, curCom.value.animations);
});
</script>

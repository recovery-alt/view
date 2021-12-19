<template>
  <VChart class="chart" :option="mergedOption" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import { computed } from 'vue';
import type { EChartsOption } from 'echarts';
import { use } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import mergeWith from 'lodash/mergeWith';

type Props = {
  data?: ComponentData;
  plugins?: Parameters<typeof use>[number];
  defaultOption?: EChartsOption;
  option?: EChartsOption;
};

const props = withDefaults(defineProps<Props>(), {
  data: () => ({ type: 'static', static: [] }),
  plugins: () => [],
  defaultOption: () => ({}),
  option: () => ({}),
});

const mergedOption = computed(() =>
  mergeWith(props.defaultOption, { dataset: { source: props.data.static } }, (oldObj, newObj) => {
    // 数组就直接替换
    if (Array.isArray(oldObj)) return newObj;
  })
);

const plugins = Array.isArray(props.plugins) ? props.plugins : [props.plugins];

use([GridComponent, CanvasRenderer, ...plugins]);
</script>

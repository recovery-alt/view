<template>
  <Chart class="scatter" :option="option" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import type { ScatterSeriesOption } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { use } from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import Chart from '../chart.vue';

const props = defineProps({
  data: {
    type: Object as PropType<ComponentData>,
    default: () => ({ type: 'static', static: [] }),
  },
});

use([ScatterChart]);

const option = computed<ComposeOption<ScatterSeriesOption>>(() => ({
  xAxis: {},
  yAxis: {},
  series: [
    {
      type: 'scatter',
      symbolSize: 20,
    },
  ],
  dataset: { source: props.data.static },
}));
</script>

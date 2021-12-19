<template>
  <Chart class="line" :option="option" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import type { LineSeriesOption } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import Chart from '../chart.vue';

const props = defineProps({
  data: {
    type: Object as PropType<ComponentData>,
    default: () => ({ type: 'static', static: [] }),
  },
});
use([LineChart]);
const option = computed<ComposeOption<LineSeriesOption>>(() => ({
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: [{ type: 'line' }],
  dataset: { source: props.data.static },
}));
</script>

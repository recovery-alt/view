<template>
  <Chart class="bar" :option="option" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import type { BarSeriesOption } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import Chart from '../chart.vue';

const props = defineProps({
  data: {
    type: Object as PropType<ComponentData>,
    default: () => ({ type: 'static', static: [] }),
  },
});

use([BarChart]);

const option = computed<ComposeOption<BarSeriesOption>>(() => ({
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: [{ type: 'bar' }],
  dataset: { source: props.data.static },
}));
</script>

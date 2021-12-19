<template>
  <Chart class="gauge" :option="option" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import type { GaugeSeriesOption } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { use } from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import Chart from '../chart.vue';

const props = defineProps({
  data: {
    type: Object as PropType<ComponentData>,
    default: () => ({ type: 'static', static: [] }),
  },
});

use([GaugeChart]);

const option = computed<ComposeOption<GaugeSeriesOption>>(() => ({
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      detail: {
        formatter: '{value}',
      },
    },
  ],
  dataset: { source: props.data.static },
}));
</script>

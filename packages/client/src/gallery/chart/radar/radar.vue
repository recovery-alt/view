<template>
  <Chart class="radar" :option="option" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import type { RadarSeriesOption } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { use } from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import Chart from '../chart.vue';

const props = defineProps({
  data: {
    type: Object as PropType<ComponentData>,
    default: () => ({ type: 'static', static: [] }),
  },
});
use([RadarChart]);

const option = computed<ComposeOption<RadarSeriesOption>>(() => ({
  radar: {
    indicator: [
      { name: '销售（Sales）', max: 6500 },
      { name: '管理（Administration）', max: 16000 },
      { name: '信息技术（Information Technology）', max: 30000 },
      { name: '客服（Customer Support）', max: 38000 },
      { name: '研发（Development）', max: 52000 },
      { name: '市场（Marketing）', max: 25000 },
    ],
  },
  series: [
    {
      name: '预算 vs 开销（Budget vs spending）',
      type: 'radar',
    },
  ],
  dataset: { source: props.data.static },
}));
</script>

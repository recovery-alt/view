<template>
  <BaseChart :plugins="BarChart" :default-option="defaultOption" />
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import { BarChart } from 'echarts/charts';
import BaseChart from '../base-chart.vue';

const defaultOption: EChartsOption = {
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: [{ type: 'bar' }],
};
</script>

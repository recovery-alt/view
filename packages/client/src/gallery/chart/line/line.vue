<template>
  <BaseChart :plugins="LineChart" :default-option="defaultOption" />
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import { reactive } from 'vue';
import { LineChart } from 'echarts/charts';
import BaseChart from '../base-chart.vue';

const defaultOption = reactive<EChartsOption>({
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: [{ type: 'line' }],
});
</script>

<template>
  <BaseChart class="gauge" :plugins="GaugeChart" :default-option="defaultOption" />
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import { reactive } from 'vue';
import { GaugeChart } from 'echarts/charts';
import BaseChart from '../base-chart.vue';

const defaultOption = reactive<EChartsOption>({
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      detail: {
        formatter: '{value}',
      },
    },
  ],
});
</script>

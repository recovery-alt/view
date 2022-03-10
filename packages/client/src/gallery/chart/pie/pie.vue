<template>
  <BaseChart :plugins="PieChart" :default-option="defaultOption" />
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import { PieChart } from 'echarts/charts';
import BaseChart from '../base-chart.vue';

const defaultOption: EChartsOption = {
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
    },
  ],
};
</script>

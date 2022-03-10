<template>
  <BaseChart :plugins="FunnelChart" :default-option="defaultOption" />
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import { FunnelChart } from 'echarts/charts';
import BaseChart from '../base-chart.vue';

const defaultOption: EChartsOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}%',
  },
  legend: {
    data: ['展现', '点击', '访问', '咨询', '订单'],
  },
  series: [
    {
      name: '漏斗图',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'inside',
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid',
        },
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
      },
      emphasis: {
        label: {
          fontSize: 20,
        },
      },
    },
  ],
};
</script>

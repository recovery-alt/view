<template>
  <Chart class="funnel" :option="option" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import type { FunnelSeriesOption } from 'echarts/charts';
import type { ComposeOption } from 'echarts/core';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { use } from 'echarts/core';
import { FunnelChart } from 'echarts/charts';
import Chart from '@/gallery/chart.vue';

const props = defineProps({
  data: {
    type: Object as PropType<ComponentData>,
    default: () => ({ type: 'static', static: [] }),
  },
});

use([FunnelChart]);

const option = computed<ComposeOption<FunnelSeriesOption>>(() => ({
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
  dataset: { source: props.data.static },
}));
</script>

<template>
  <Chart class="tree" :option="option" />
</template>

<script lang="ts" setup>
import type { ComponentData } from '@/typings';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { use } from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import Chart from '../chart.vue';

const props = defineProps({
  data: {
    type: Object as PropType<ComponentData>,
    default: () => ({ type: 'static', static: [] }),
  },
});

use([TreeChart]);

const option = computed(() => ({
  series: [
    {
      type: 'tree',
      data: props.data.static,
      top: '1%',
      left: '7%',
      bottom: '1%',
      right: '20%',
      symbolSize: 7,
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 9,
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
        },
      },
      emphasis: {
        focus: 'descendant',
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
    },
  ],
}));
</script>

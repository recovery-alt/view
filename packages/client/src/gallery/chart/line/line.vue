<template>
  <div ref="line" class="line" />
</template>

<script lang="ts">
import type { ComponentData } from '@/typings';
import type { LineSeriesOption } from 'echarts/charts';
import type { ComposeOption, ECharts } from 'echarts/core';
import type { PropType } from 'vue';
import { onMounted, shallowRef, watchEffect, defineComponent } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ComponentData>,
      default: () => ({ type: 'static', data: [] }),
    },
  },
  setup(props) {
    const line = shallowRef<HTMLElement>();
    const chart = shallowRef<ECharts>();

    use([GridComponent, LineChart, CanvasRenderer]);

    const setOption = () => {
      if (!chart.value) return;
      const option: ComposeOption<LineSeriesOption> = {
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'line' }],
        dataset: { source: props.data.static },
      };

      chart.value.setOption(option);
    };

    onMounted(() => {
      if (line.value) {
        chart.value = init(line.value);
        watchEffect(setOption);
      }
    });

    return { line };
  },
});
</script>

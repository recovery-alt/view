<template>
  <div ref="scatter" class="scatter" />
</template>

<script lang="ts">
import type { ScatterSeriesOption } from 'echarts/charts';
import type { ComposeOption, ECharts } from 'echarts/core';
import type { PropType } from 'vue';
import { onMounted, shallowRef, watchEffect, defineComponent } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { ScatterChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ComponentData>,
      default: () => ({ type: 'static', data: [] }),
    },
  },
  setup(props) {
    const scatter = shallowRef<HTMLElement>();
    const chart = shallowRef<ECharts>();

    use([GridComponent, ScatterChart, CanvasRenderer]);

    const setOption = () => {
      if (!chart.value) return;
      const option: ComposeOption<ScatterSeriesOption> = {
        xAxis: {},
        yAxis: {},
        series: [
          {
            type: 'scatter',
            symbolSize: 20,
          },
        ],
        dataset: { source: props.data.static },
      };

      chart.value.setOption(option);
    };

    onMounted(() => {
      if (scatter.value) {
        chart.value = init(scatter.value);
        watchEffect(setOption);
      }
    });

    return { scatter };
  },
});
</script>

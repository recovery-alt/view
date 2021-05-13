<template>
  <div ref="gauge" class="gauge" />
</template>

<script lang="ts">
import type { GaugeSeriesOption } from 'echarts/charts';
import type { ComposeOption, ECharts } from 'echarts/core';
import type { DatasetComponentOption } from 'echarts/index';
import type { PropType } from 'vue';
import { onMounted, shallowRef, watchEffect, defineComponent } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ComponentData>,
      default: () => ({ type: 'static', data: [] }),
    },
  },
  setup(props) {
    const gauge = shallowRef<HTMLElement>();
    const chart = shallowRef<ECharts>();

    use([GridComponent, GaugeChart, CanvasRenderer]);

    const setOption = () => {
      if (!chart.value) return;
      const option: ComposeOption<GaugeSeriesOption | DatasetComponentOption> = {
        series: [
          {
            name: 'Pressure',
            type: 'gauge',
            detail: {
              formatter: '{value}',
            },
          },
        ],
        dataset: { source: props.data.static },
      };

      chart.value.setOption(option);
    };

    onMounted(() => {
      if (gauge.value) {
        chart.value = init(gauge.value);
        watchEffect(setOption);
      }
    });

    return { gauge };
  },
});
</script>

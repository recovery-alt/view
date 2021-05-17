<template>
  <div ref="pie" class="pie" />
</template>

<script lang="ts">
import type { PieSeriesOption } from 'echarts/charts';
import type { ComposeOption, ECharts } from 'echarts/core';
import type { PropType } from 'vue';
import { onMounted, shallowRef, watchEffect, defineComponent } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ComponentData>,
      default: () => ({ type: 'static', data: [] }),
    },
  },
  setup(props) {
    const pie = shallowRef<HTMLElement>();
    const chart = shallowRef<ECharts>();

    use([GridComponent, PieChart, CanvasRenderer]);

    const setOption = () => {
      if (!chart.value) return;
      const option: ComposeOption<PieSeriesOption> = {
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
        dataset: { source: props.data.static },
      };

      chart.value.setOption(option);
    };

    onMounted(() => {
      if (pie.value) {
        chart.value = init(pie.value);
        watchEffect(setOption);
      }
    });

    return { pie };
  },
});
</script>

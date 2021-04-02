<template>
  <div ref="bar" class="bar" />
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType, shallowRef, watchEffect } from 'vue';
import { use, init, ComposeOption, ECharts } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { DataSource } from '@/enum';

export default defineComponent({
  name: 'bar',
  props: {
    data: {
      type: Object as PropType<ComponentData>,
      default: () => ({ type: DataSource.STATIC, data: [] }),
    },
  },
  setup(props) {
    const bar = shallowRef<HTMLElement>();
    const chart = shallowRef<ECharts>();

    use([GridComponent, BarChart, CanvasRenderer]);

    watchEffect(() => {
      if (!chart.value || props.data.type !== DataSource.STATIC) return;
      const option: ComposeOption<BarSeriesOption> = {
        dataset: { source: props.data.static },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'bar' }],
      };

      chart.value.setOption(option);
    });

    onMounted(() => {
      if (bar.value) {
        chart.value = init(bar.value);
      }
    });

    return { bar };
  },
});
</script>

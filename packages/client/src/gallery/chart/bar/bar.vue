<template>
  <div ref="bar" class="bar" />
</template>

<script lang="ts">
import type { BarSeriesOption } from 'echarts/charts';
import type { ComposeOption, ECharts } from 'echarts/core';
import type { DatasetComponentOption } from 'echarts/index';
import type { PropType } from 'vue';
import { onMounted, shallowRef, watchEffect, defineComponent } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { DataSource } from '@/enum';

export default defineComponent({
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

    const defaultOption: ComposeOption<BarSeriesOption> = {
      xAxis: { type: 'category' },
      yAxis: { type: 'value' },
      series: [{ type: 'bar' }],
    };

    const setOption = () => {
      if (!chart.value) return;
      const option: ComposeOption<BarSeriesOption | DatasetComponentOption> = {
        ...defaultOption,
        dataset: { source: props.data.static },
      };

      chart.value.setOption(option);
    };

    onMounted(() => {
      if (bar.value) {
        chart.value = init(bar.value);
        watchEffect(setOption);
      }
    });

    return { bar };
  },
});
</script>

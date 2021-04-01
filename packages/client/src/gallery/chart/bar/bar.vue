<template>
  <div ref="bar" class="bar" />
</template>

<script lang="ts">
import { onMounted, ref, defineComponent, PropType, watch } from 'vue';
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
    const bar = ref<HTMLElement>();
    const chart = ref<ECharts>();

    use([GridComponent, BarChart, CanvasRenderer]);

    onMounted(() => {
      if (!bar.value) return;
      chart.value = init(bar.value);

      const option: ComposeOption<BarSeriesOption> = {
        dataset: { source: props.data.data },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }],
      };

      chart.value.setOption(option);
    });

    return { bar };
  },
});
</script>

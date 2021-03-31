<template>
  <div ref="bar" class="bar" />
</template>

<script lang="ts">
import { onMounted, ref, defineComponent, PropType } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { DataSource } from '@/enum';
import { handleChartData } from '@/utils';

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

    use([GridComponent, BarChart, CanvasRenderer]);

    onMounted(() => {
      if (!bar.value) return;
      const chart = init(bar.value);
      const dataset = handleChartData(props.data.data);

      const option = {
        xAxis: {
          type: 'category',
          data: dataset[0].data,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: dataset[1].data,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
          },
        ],
      };
      chart.setOption(option);
    });

    return { bar };
  },
});
</script>

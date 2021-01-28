<template>
  <div class="bar"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useBoardRefs } from '@/hooks';

type Props = { index: number };

export default defineComponent({
  name: 'bar',
  props: {
    index: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props: Props) {
    use([GridComponent, BarChart, CanvasRenderer]);

    onMounted(() => {
      const { boardRefs } = useBoardRefs();
      const dom = boardRefs[props.index];
      const chart = init(dom);
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
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
  },
});
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div ref="bar" class="bar" />
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default {
  name: 'bar',
  setup() {
    const bar = ref<HTMLElement | null>(null);

    use([GridComponent, BarChart, CanvasRenderer]);

    onMounted(() => {
      if (!bar.value) return;
      const chart = init(bar.value);
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

    return { bar };
  },
};
</script>

<style lang="less" scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>

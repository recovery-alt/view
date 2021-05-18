<template>
  <div ref="tree" class="tree" />
</template>

<script lang="ts">
import type { TreeSeriesOption } from 'echarts/charts';
import type { ComposeOption, ECharts } from 'echarts/core';
import type { PropType } from 'vue';
import { onMounted, shallowRef, watchEffect, defineComponent } from 'vue';
import { use, init } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { TreeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ComponentData>,
      default: () => ({ type: 'static', data: [] }),
    },
  },
  setup(props) {
    const tree = shallowRef<HTMLElement>();
    const chart = shallowRef<ECharts>();

    use([GridComponent, TreeChart, CanvasRenderer]);

    const setOption = () => {
      if (!chart.value) return;
      const option: ComposeOption<TreeSeriesOption> = {
        series: [
          {
            type: 'tree',
            //@ts-expect-error data type cannot infer
            data: props.data.static,
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 9,
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
              },
            },
            emphasis: {
              focus: 'descendant',
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      };

      chart.value.setOption(option);
    };

    onMounted(() => {
      if (tree.value) {
        chart.value = init(tree.value);
        watchEffect(setOption);
      }
    });

    return { tree };
  },
});
</script>

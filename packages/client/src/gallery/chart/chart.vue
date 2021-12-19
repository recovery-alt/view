<template>
  <VChart class="chart" :option="data" />
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts';
import type { PropType } from 'vue';
import { use } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

defineProps({ data: Object as PropType<EChartsOption> });
use([GridComponent, CanvasRenderer]);
</script>

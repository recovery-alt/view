import { defineAsyncComponent } from 'vue';

export default {
  type: 'bar',
  name: '柱状图',
  component: defineAsyncComponent(() => import('./bar.vue')),
};

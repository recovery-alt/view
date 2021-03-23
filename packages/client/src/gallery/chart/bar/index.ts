import { defineAsyncComponent } from 'vue';

export default {
  name: '柱状图',
  component: defineAsyncComponent(() => import('./bar.vue')),
};

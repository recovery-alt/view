import { defineAsyncComponent } from 'vue';

export default {
  type: 'box',
  name: '盒子',
  component: defineAsyncComponent(() => import('./box.vue')),
};

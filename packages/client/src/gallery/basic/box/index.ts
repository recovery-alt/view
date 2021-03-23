import { defineAsyncComponent, Component } from 'vue';

export default {
  name: '盒子',
  component: defineAsyncComponent<Component>(() => import('./box.vue')),
};

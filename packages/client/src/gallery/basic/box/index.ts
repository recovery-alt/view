import { defineAsyncComponent, Component } from 'vue';

const gallery: Gallery = {
  name: '盒子',
  version: '0.1.0',
  component: defineAsyncComponent<Component>(() => import('./box.vue')),
};

export default gallery;

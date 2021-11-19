import type { Gallery } from '@/typings';
import { defineAsyncComponent, Component } from 'vue';

const gallery: Gallery = {
  name: 'carousel',
  version: '0.1.0',
  style: {
    width: 300,
    height: 240,
  },
  component: defineAsyncComponent<Component>(() => import('./carousel.vue')),
};

export default gallery;

import { defineAsyncComponent, Component } from 'vue';
import type { Gallery } from '@/typings';

const gallery: Gallery = {
  name: '轮播图',
  version: '0.1.0',
  defaultStyle: {
    width: 300,
    height: 240,
  },
  component: defineAsyncComponent<Component>(() => import('./carousel.vue')),
};

export default gallery;

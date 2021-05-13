import { defineAsyncComponent, Component } from 'vue';

const gallery: Gallery = {
  name: '轮播图',
  version: '0.1.0',
  style: {
    width: 300,
    height: 240,
  },
  component: defineAsyncComponent<Component>(() => import('./carousel.vue')),
};

export default gallery;

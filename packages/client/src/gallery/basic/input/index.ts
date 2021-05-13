import { defineAsyncComponent, Component } from 'vue';

const gallery: Gallery = {
  name: '输入框',
  version: '0.1.0',
  component: defineAsyncComponent<Component>(() => import('./input.vue')),
  style: {
    width: 240,
    height: 30,
  },
  propsData: {
    value: '123',
  },
};

export default gallery;

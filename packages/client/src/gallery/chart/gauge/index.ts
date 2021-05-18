import type { Gallery } from '@/typings';
import { defineAsyncComponent } from 'vue';

const gallery: Gallery = {
  name: '码表图',
  version: '0.1.0',
  style: {
    width: 400,
    height: 300,
  },
  data: {
    type: 'static',
    static: [
      {
        value: 50,
        name: 'SCORE',
      },
    ],
  },
  component: defineAsyncComponent(() => import('./gauge.vue')),
};

export default gallery;

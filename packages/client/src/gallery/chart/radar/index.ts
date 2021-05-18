import type { Gallery } from '@/typings';
import { defineAsyncComponent } from 'vue';

const gallery: Gallery = {
  name: '雷达图',
  version: '0.1.0',
  style: {
    width: 400,
    height: 300,
  },
  data: {
    type: 'static',
    static: [
      {
        value: [4200, 3000, 20000, 35000, 50000, 18000],
        name: '预算分配（Allocated Budget）',
      },
      {
        value: [5000, 14000, 28000, 26000, 42000, 21000],
        name: '实际开销（Actual Spending）',
      },
    ],
  },
  component: defineAsyncComponent(() => import('./radar.vue')),
};

export default gallery;

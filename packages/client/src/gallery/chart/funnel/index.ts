import { defineAsyncComponent } from 'vue';

const gallery: Gallery = {
  name: '漏斗图',
  version: '0.1.0',
  style: {
    width: 400,
    height: 500,
  },
  data: {
    type: 'static',
    static: [
      { value: 60, name: '访问' },
      { value: 40, name: '咨询' },
      { value: 20, name: '订单' },
      { value: 80, name: '点击' },
      { value: 100, name: '展现' },
    ],
  },
  component: defineAsyncComponent(() => import('./funnel.vue')),
};

export default gallery;

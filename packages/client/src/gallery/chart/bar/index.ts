import { defineAsyncComponent } from 'vue';

const gallery: Gallery = {
  name: '柱状图',
  version: '0.1.0',
  defaultStyle: {
    width: 400,
    height: 300,
  },
  component: defineAsyncComponent(() => import('./bar.vue')),
};

export default gallery;

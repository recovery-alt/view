import { defineAsyncComponent } from 'vue';

const gallery: Gallery = {
  name: '环形图',
  version: '0.1.0',
  style: {
    width: 400,
    height: 300,
  },
  dataset: {
    type: 'static',
    static: [
      { x: 'Mon', y: 120 },
      { x: 'Tue', y: 200 },
      { x: 'Wed', y: 150 },
      { x: 'Thu', y: 80 },
      { x: 'Fri', y: 70 },
      { x: 'Sat', y: 110 },
      { x: 'Sun', y: 130 },
    ],
  },
  component: defineAsyncComponent(() => import('./pie.vue')),
};

export default gallery;

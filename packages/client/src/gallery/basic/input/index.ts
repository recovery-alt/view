import type { Gallery } from '@/typings';
import { FormEnum } from '@/enum';
import { defineAsyncComponent, Component } from 'vue';

const gallery: Gallery = {
  name: 'input',
  version: '0.1.0',
  component: defineAsyncComponent<Component>(() => import('./input.vue')),
  style: {
    width: 240,
    height: 30,
  },
  propsData: {
    value: '',
  },
  attr: [
    {
      title: '属性配置',
      fields: [
        {
          label: '输入值',
          item: {
            type: FormEnum.INPUT,
            model: 'value',
          },
        },
      ],
    },
  ],
};

export default gallery;

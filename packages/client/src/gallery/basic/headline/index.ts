import type { Gallery } from '@/typings';
import { FormEnum } from '@/enum';
import { defineAsyncComponent, Component } from 'vue';

const gallery: Gallery = {
  name: '标题',
  version: '0.1.0',
  component: defineAsyncComponent<Component>(() => import('./headline.vue')),
  style: {
    width: 240,
    height: 40,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.7,
  },
  propsData: {
    value: '我是标题',
  },
  attr: [
    {
      title: '属性配置',
      fields: [
        {
          label: '标题名称',
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

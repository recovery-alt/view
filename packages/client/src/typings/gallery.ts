import type { Component as VueComponent } from 'vue';
import type { Data, SchemaItem } from './common';
import type { Component, CSSStyleDataWithRotate } from './board';

export interface Gallery extends Omit<Component, 'id' | 'label' | 'component' | 'style'> {
  type?: string;
  name: string;
  version: string;
  component: VueComponent;
  icon?: string; // 组件对应的图表
  attr?: Array<SchemaItem>; // 额外的组件配置
  dataConfig?: boolean; // 是否需要配置数据
  style?: Partial<CSSStyleDataWithRotate>;
}

export type Group = {
  name: string;
  icon: VueComponent;
  order: number;
  dataConfig?: boolean;
  components: Data<() => Promise<{ [key: string]: Gallery }>>;
};

export type GalleryGroup = {
  groupName: string;
  icon: VueComponent;
  list: Array<Gallery>;
};

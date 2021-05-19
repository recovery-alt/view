import type { Data } from './common';
import type { CSSProperties } from 'vue';
import type { DataSourceKey } from '@/config';

export interface CSSStyleDataWithSize extends CSSProperties {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface CSSStyleDataWithRotate extends Omit<CSSStyleDataWithSize, 'rotate'> {
  rotate: number;
  opacity: number;
}

export type ComponentData = {
  type: DataSourceKey;
  url?: string;
  static?: Array<Data | Array<Data> | Array<number>>;
  filter?: string;
};

export type Animation = {
  name: string;
  label: string;
  animationDuration: number;
  animationDelay: number;
  animationIterationCount: number;
  repeat: boolean;
};

export type Component = {
  id: string; // 组件唯一标识
  component: string; // 组件名
  label: string; // 组件标签
  group?: Array<Component>; // 成组包含的所有组件
  propsData?: Data<string | number>; // 传入props
  locked?: boolean; // 是否加锁
  animations?: Array<Animation>; // 动画
  events?: Array<Event>; // 组件事件
  data?: ComponentData; // 数据集
  style: CSSStyleDataWithRotate; // 样式
};

export type Page = {
  __v: number;
  _id: string; // 页面唯一标识
  title: string; // 标题
  description: string; // 描述文案
  author: string; // 作者
  width: number; // 宽
  height: number; // 高
  backgroundColor: string; // 背景色
  scale: number; // 缩放百分比
  zoom: number; // 页面放缩方式
  gap: number; // 删格大小
  url: string; // 背景图片
  pageMode: number; // 页面模式 0 可视化大屏 1 h5
  components: Array<Component>; // 页面所有组件
};

export type PageConfig = Omit<Page, 'components'>;

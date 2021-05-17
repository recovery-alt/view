type ResponseData<T = any> = {
  code: number;
  data: T;
  msg: string;
};

type Data<T = unknown> = Record<string, T>;

type CSSStyleFilter =
  | number
  | 'parentRule'
  | 'length'
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'item'
  | 'removeProperty'
  | 'setProperty';

type CSSStyleData = Partial<Omit<CSSStyleDeclaration, CSSStyleFilter>>;

interface CSSStyleDataWithSize extends CSSStyleData, Data<string | number> {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface CSSStyleDataWithRotate extends CSSStyleDataWithSize {
  rotate: number;
  opacity: number;
}

type ComponentData = {
  type: import('@/config').DataSourceKey;
  url?: string;
  static?: Array<Data | Array<Data> | Array<number>>;
  filter?: string;
};

type Component = {
  id: string; // 组件唯一标识
  component: string; // 组件名
  label: string; // 组件标签
  group?: Array<Component>; // 成组包含的所有组件
  propsData?: Data<string | number>; // 传入props
  locked?: boolean; // 是否加锁
  animations?: Array<string>; // 动画
  events?: Array<Event>; // 组件事件
  dataset?: ComponentData; // 数据集
  style: CSSStyleDataWithRotate; // 样式
};

type Board = {
  selected: Array<number>;
  data: Array<Component>;
};

type Snapshot = {
  index: number;
  data: Array<Page>;
};

type Page = {
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
  config: Array<Component>; // 页面所有组件
};

type RootStateType = {
  board: Board;
  snapshot: Snapshot;
};

type PageConfig = Omit<Page, '_id' | 'config'>;

type UserInfo = { token: string; name: string };

type ColumnConfig = { key: string; title: string; dataIndex?: string };

interface Gallery extends Omit<Component, 'id' | 'label'> {
  type?: string;
  name: string;
  version: string;
  component: import('vue').Component;
  icon?: string; // 组件对应的图表
  attr?: Array<SchemaItem>; // 额外的组件配置
  dataConfig?: boolean; // 是否需要配置数据
  style?: Partial<CSSStyleDataWithRotate>;
}

type Group = {
  name: string;
  icon: import('vue').Component;
  order: number;
  dataConfig?: boolean;
  components: Data<() => Promise<{ [key: string]: Gallery }>>;
};

type GalleryGroup = Array<{
  groupName: string;
  icon: import('vue').Component;
  list: Array<Gallery>;
}>;

type FieldItem = {
  type: import('@/enum').FormEnum;
  model: string;
  span?: number;
  offset?: number;
  props?: Data<string | number>;
  default?: string | number;
  data?: Array<Data<any>>;
};

type Field = {
  label: string;
  extra?: Array<string>;
  item: Array<FieldItem> | FieldItem;
};

type SchemaItem = {
  title: string;
  fields: Array<Field>;
};

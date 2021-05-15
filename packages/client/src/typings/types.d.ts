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
  static?: Array<Data | Array>;
  filter?: (data: unknown) => unknown;
};

type Component = {
  id: string;
  component: string;
  label: string;
  group?: Array<Component>;
  propsData?: Data<string | number>;
  locked?: boolean;
  icon?: string;
  attr?: Array<SchemaItem>;
  animations?: Array<string>;
  events?: Array<Event>;
  dataConfig?: boolean;
  dataset?: ComponentData;
  style: CSSStyleDataWithRotate;
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
  _id: string;
  title: string;
  description: string;
  author: string;
  width: number;
  height: number;
  backgroundColor: string;
  scale: number;
  zoom: number;
  gap: number;
  url: string;
  pageMode: number;
  config: Array<Component>;
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

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

type ComponentAttr = {
  key: CSSStyleKey;
  type: import('@/enum').FormEnum;
  label: string;
  default: string | number;
  props?: Data;
  config?: Data;
  data?: Array<{ id: number | string; label: string }>;
};

type ComponentData = {
  type: import('@/config').DataSourceKey;
  url?: string;
  static?: Array<Data>;
  filter?: (data: unknown) => unknown;
};

type Component = {
  id: string;
  component: string;
  label: string;
  group?: Array<Component>;
  propValue?: unknown;
  locked?: boolean;
  icon?: string;
  attr?: Array<{ title: string; data: Array<ComponentAttr> }>;
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

type Gallery = {
  type?: string;
  name: string;
  version: string;
  dataConfig?: boolean;
  defaultStyle?: Partial<CSSStyleDataWithRotate>;
  defaultDataset?: ComponentData;
  component: import('vue').Component;
};

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

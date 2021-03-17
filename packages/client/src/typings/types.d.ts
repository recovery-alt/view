declare enum FormEnum {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  INPUT = 'input',
  INPUT_NUMBER = 'input-number',
  SELECT = 'select',
  SWITCH = 'switch',
  SLIDER = 'slider',
  COLOR_PICKER = 'color-picker',
}

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

type CSSStyleKey = Exclude<keyof CSSStyleDeclaration, CSSStyleFilter>;

type CSSStyleData<T = string | number> = { [key in CSSStyleKey]?: T };

interface CSSStyleDataWithSize extends CSSStyleData {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface CSSStyleDataWithRotate extends CSSStyleDataWithSize {
  rotate: number;
}

type ComponentAttr = {
  key: CSSStyleKey;
  type: FormEnum;
  label: string;
  config?: Data;
  data?: Array<{ id: number | string; label: string }>;
};

type Component = {
  id: string;
  component: string;
  label: string;
  propValue?: unknown;
  icon?: string;
  attr?: Array<{ title: string; data: Array<ComponentAttr> }>;
  animations?: Array<string>;
  events?: Array<Event>;
  style: CSSStyleDataWithRotate;
};

type Board = {
  selected: Array<number>;
  data: Array<Component>;
  copy?: Array<Component>;
};

type Snapshot = {
  index: number;
  data: Array<Board>;
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

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
  propValue?: string;
  icon?: string;
  attr: Array<ComponentAttr>;
  animations?: Array<any>;
  events?: Array<Event>;
  style: CSSStyleDataWithSize;
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

type RootStateType = {
  board: Board;
  snapshot: Snapshot;
};

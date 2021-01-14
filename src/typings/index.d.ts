type ResponseData<T = any> = {
  code: number;
  data: T;
  msg: string;
};

type Data<T = unknown> = Record<string, T>;

type Pos = {
  top: number;
  left: number;
  right?: number;
  bottom?: number;
};

type Component = {
  id?: string;
  component: string;
  label?: string;
  propValue?: string;
  icon?: string;
  animations?: Array<any>;
  events?: Array<Event>;
  position: Pos;
  style: Partial<CSSStyleDeclaration>;
};

type Board = {
  index: number;
  data: Array<Component>;
};

type Snapshot = {
  index: number;
  data: Array<Board>;
};

type RootStateType = {};

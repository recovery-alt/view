type ResponseData<T = any> = {
  code: number;
  data: T;
  msg: string;
};

type Data<T = unknown> = Record<string, T>;

type Component = {
  component: string;
  label?: string;
  propValue?: string;
  icon?: string;
  animations?: Array<any>;
  events?: Array<Event>;
  style?: Data;
};

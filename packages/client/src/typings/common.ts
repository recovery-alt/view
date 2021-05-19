import { FormEnum } from '@/enum';
import { VNode } from 'vue';

export type ResponseData<T = any> = {
  code: number;
  data: T;
  msg: string;
};

export type Data<T = unknown> = Record<string, T>;

export type UserInfo = { token: string; name: string };

export type ColumnConfig = { key: string; title: string; dataIndex?: string };

export type FieldItem = {
  type: FormEnum;
  model: string;
  span?: number;
  offset?: number;
  propsData?: Data<string | number>;
  default?: string | number;
  data?: Array<Data<any>>;
  customNode?: VNode;
};

export type Field = {
  label: string;
  extra?: Array<string>;
  item: Array<FieldItem> | FieldItem;
};

export type SchemaItem = {
  title: string;
  fields: Array<Field>;
};

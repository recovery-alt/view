export default {
  maxSnapshot: 20,
  defaultComponentSize: { width: 100, height: 100 },
  defaultPageSize: { width: 1920, height: 1080 },
};

export const DataSource = {
  url: '接口数据',
  static: '静态数据',
} as const;

export type DataSourceKey = keyof typeof DataSource;

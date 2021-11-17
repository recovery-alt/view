export default {
  maxSnapshot: 20,
  defaultComponentSize: { width: 100, height: 100 },
  defaultPageSize: { width: 1920, height: 1080 },
};

export const DataSource = ['url', 'static'] as const;

export type DataSourceKey = typeof DataSource[number];

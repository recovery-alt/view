export const generateColumns = (columns: ColumnConfig[]) =>
  columns.map(item => ({
    ...item,
    dataIndex: item.dataIndex || item.key,
    align: 'center',
    slots: { customRender: item.key },
  }));

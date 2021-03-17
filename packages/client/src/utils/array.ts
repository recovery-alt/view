export const generateColumns = (columns: ColumnConfig[]) =>
  columns.map(item => ({
    ...item,
    dataIndex: item.dataIndex || item.key,
    align: 'center',
    slots: { customRender: item.key },
  }));

export const spliceItems = <T>(arr: T[], indexArr: number[]) => {
  const selectedItems = indexArr.map(index => arr[index]);
  selectedItems.forEach(item => {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
  });
  return selectedItems;
};

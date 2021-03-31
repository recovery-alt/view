export const handleChartData = (data: Array<Data>) => {
  const result: Array<{ key: string; data: Array<unknown> }> = [];

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      const val = item[key];
      const finder = result.find(val => val.key === key);
      finder ? finder.data.push(val) : result.push({ key, data: [val] });
    });
  });
  return result;
};

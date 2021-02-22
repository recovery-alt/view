export const patchUnit = (style: Data) => {
  const needAddPixelList = [
    'width',
    'height',
    'top',
    'left',
    'bottom',
    'right',
    'fontSize',
    'borderWidth',
    'borderRadius',
  ];
  const result: Data = {};
  for (const [key, value] of Object.entries(style)) {
    // rotate特殊处理
    if (key === 'rotate') {
      result.transform = `rotate(${value}deg)`;
      continue;
    }
    result[key] = needAddPixelList.includes(key) ? value + 'px' : value;
  }
  return result;
};

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
  Object.keys(style).forEach(key => {
    result[key] = needAddPixelList.includes(key) ? style[key] + 'px' : style[key];
  });
  return result;
};

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
    if (!value) continue;

    // rotate特殊处理
    if (key === 'rotate') {
      result.transform = `rotate(${value}deg)`;
      continue;
    }

    result[key] = needAddPixelList.includes(key) ? value + 'px' : value;
  }
  return result;
};

export const splitStyleAndPatch = (style: Data, position = true) => {
  const { width, height, left, top, ...resStyle } = style;
  const data = position ? { width, height, left, top } : { ...resStyle };
  return patchUnit(data);
};

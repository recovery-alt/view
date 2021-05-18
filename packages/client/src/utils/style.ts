import type { Data, CSSStyleDataWithRotate } from '@/typings';

export const patchUnit = (style: Data | CSSStyleDataWithRotate) => {
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

    if (key === 'scale') {
      result.transform = `scale(${(value as number) / 100})`;
      continue;
    }

    result[key] = needAddPixelList.includes(key) ? value + 'px' : value;
  }
  return result;
};

export const splitStyleAndPatch = (style: CSSStyleDataWithRotate, position = true) => {
  const { width, height, left, top, ...resStyle } = style;
  const data = position ? { width, height, left, top } : { ...resStyle };
  return patchUnit(data);
};

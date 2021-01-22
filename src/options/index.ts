import { FormEnum } from '@/enum';

export const defaultComponentSize = {
  width: 100,
  height: 100,
};

export const presetComponentAttr: Array<ComponentAttr> = [
  {
    key: 'borderRadius',
    type: FormEnum.INPUT_NUMBER,
    label: '圆角',
  },
  {
    key: 'backgroundColor',
    type: FormEnum.COLOR_PICKER,
    label: '背景色',
  },
];

export const presetSizeInfo: Array<ComponentAttr> = [
  {
    key: 'width',
    type: FormEnum.INPUT_NUMBER,
    label: '宽',
  },
  {
    key: 'height',
    type: FormEnum.INPUT_NUMBER,
    label: '高',
  },
  {
    key: 'left',
    type: FormEnum.INPUT_NUMBER,
    label: '距离左侧',
  },
  {
    key: 'top',
    type: FormEnum.INPUT_NUMBER,
    label: '距离上方',
  },
];

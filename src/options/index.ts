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
  {
    key: 'borderWidth',
    type: FormEnum.INPUT_NUMBER,
    label: '边框大小',
  },
  {
    key: 'borderColor',
    type: FormEnum.COLOR_PICKER,
    label: '边框颜色',
  },
  {
    key: 'borderStyle',
    type: FormEnum.SELECT,
    label: '边框线型',
    data: [
      { id: 'none', label: '无边框' },
      { id: 'dotted', label: '点状' },
      { id: 'dashed', label: '虚线' },
      { id: 'solid', label: '实线' },
    ],
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

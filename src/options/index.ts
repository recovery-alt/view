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

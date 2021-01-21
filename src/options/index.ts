export const defaultComponentSize = {
  width: 100,
  height: 100,
};

export const presetComponentAttr: Array<ComponentAttr> = [
  {
    key: 'borderWidth',
    type: FormEnum.INPUT_NUMBER,
    label: '边框',
  },
  {
    key: 'backgroundColor',
    type: FormEnum.COLOR_PICKER,
    label: '背景色',
  },
];

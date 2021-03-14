import { FormEnum } from '@/enum';

export default {
  maxSnapshot: 20,
  defaultComponentSize: { width: 100, height: 100 },
  defaultBoardSize: { width: 1920, height: 1080 },
};

export const presetComponentAttr: Array<{
  title: string;
  data: Array<ComponentAttr>;
}> = [
  {
    title: '边框&圆角',
    data: [
      {
        key: 'borderRadius',
        type: FormEnum.INPUT_NUMBER,
        label: '圆角',
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
    ],
  },
  {
    title: '颜色',
    data: [{ key: 'backgroundColor', type: FormEnum.COLOR_PICKER, label: '背景色' }],
  },
];

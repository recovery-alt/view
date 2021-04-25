import { FormEnum } from '@/enum';

export default {
  maxSnapshot: 20,
  defaultComponentSize: { width: 100, height: 100 },
  defaultPageSize: { width: 1920, height: 1080 },
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
        default: 0,
        label: '圆角',
      },
      {
        key: 'borderWidth',
        type: FormEnum.INPUT_NUMBER,
        default: 0,
        label: '边框大小',
      },
      {
        key: 'borderColor',
        type: FormEnum.COLOR_PICKER,
        default: '',
        label: '边框颜色',
      },
      {
        key: 'borderStyle',
        type: FormEnum.SELECT,
        label: '边框线型',
        default: 'none',
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
    title: '字体',
    data: [
      {
        key: 'fontSize',
        type: FormEnum.INPUT_NUMBER,
        label: '大小',
        default: 14,
      },
      {
        key: 'fontWeight',
        type: FormEnum.INPUT_NUMBER,
        label: '粗细',
        default: 500,
        props: { step: 100, min: 100, max: 900 },
      },
      {
        key: 'lineHeight',
        type: FormEnum.INPUT_NUMBER,
        label: '行高',
        default: 1,
        props: { step: 0.1 },
      },
      {
        key: 'letterSpacing',
        type: FormEnum.INPUT_NUMBER,
        label: '文字间距',
        default: 0,
      },
      {
        key: 'color',
        type: FormEnum.COLOR_PICKER,
        label: '字体颜色',
        default: '',
      },
    ],
  },
  {
    title: '颜色',
    data: [
      {
        key: 'backgroundColor',
        type: FormEnum.COLOR_PICKER,
        label: '背景色',
        default: '',
      },
    ],
  },
];

export const DataSource = {
  url: '接口数据',
  static: '静态数据',
} as const;

export type DataSourceKey = keyof typeof DataSource;

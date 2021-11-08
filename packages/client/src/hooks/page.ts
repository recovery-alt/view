import type { Page, PageConfig } from '@/typings';
import { shallowReactive, toRaw } from 'vue';
import { addPage, updatePage } from '@/api';
import cloneDeep from 'lodash/cloneDeep';
import { message } from 'ant-design-vue';
import config from '@/config';
import { useRouter } from 'vue-router';
import { useBoardStore } from '@/store';

const pageConfig = shallowReactive<PageConfig>({
  _id: '', // 页面唯一标识
  __v: 0,
  ...config.defaultPageSize,
  title: '', // 标题
  description: '', // 描述文案
  backgroundColor: '', // 背景色
  scale: 100, // 缩放百分比
  gap: 1, // 删格大小
  url: '', // 背景图片
  zoom: 0, // 页面是否放缩
  author: '', // 作者
  pageMode: 0, // 页面模式 0 可视化大屏 1 h5
});

const cachePage: Page = { ...pageConfig, components: [] };

const updateCachePage = () => {
  const board = useBoardStore();
  Object.assign(cachePage, pageConfig);
  cachePage.components = cloneDeep(toRaw(board.data));
};

const savePage = async () => {
  const board = useBoardStore();
  const router = useRouter();
  if (board.data.length === 0) {
    message.error('尚未添加任何组件！');
    return;
  }
  // TODO: 校验表单
  const components = cloneDeep(toRaw(board.data));
  const page: Page = { components, ...pageConfig };
  const { _id, ...resConfig } = page;
  if (_id) {
    const res = await updatePage(toRaw(page));
    if (res.code === 0) {
      message.success('保存成功！');
      updateCachePage();
    }
  } else {
    const res = await addPage<Page>({ ...resConfig });
    if (res.code === 0) {
      message.success('创建成功！');
      pageConfig._id = res.data._id;
      updateCachePage();
      router.push(`/editor/${res.data._id}`);
    }
  }
};

const wrapScale = (size: number, isMultiply = false) => {
  const percent = pageConfig.scale / 100;
  const result = isMultiply ? size * percent : size / percent;
  return Math.floor(result);
};

const isModified = () => {
  const board = useBoardStore();
  const now = { ...pageConfig, components: toRaw(board.data) };
  return JSON.stringify(now) !== JSON.stringify(cachePage);
};

export { pageConfig, savePage, wrapScale, updateCachePage, isModified };

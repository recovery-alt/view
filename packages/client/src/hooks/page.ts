import { reactive, toRaw } from 'vue';
import { addPage, updatePage } from '@/api';
import { Store } from 'vuex';
import { cloneDeep } from 'lodash';
import { message } from 'ant-design-vue';
import config from '@/config';
import { Router } from 'vue-router';

const pageConfig = reactive<Page>({
  _id: '',
  ...config.defaultPageSize,
  title: '',
  description: '',
  backgroundColor: '',
  scale: 100,
  gap: 1,
  url: '',
  zoom: 0,
  author: '',
  pageMode: 0,
  config: [],
});

const setPageConfig = async (config: PageConfig) => {
  Object.assign(pageConfig, config);
};

const savePage = async (store: Store<RootStateType>, router: Router) => {
  const { board } = store.state;
  if (board.data.length === 0) {
    message.error('尚未添加任何组件！');
    return;
  }
  const config = cloneDeep(toRaw(board.data));
  pageConfig.config = config;
  const { _id, ...resConfig } = pageConfig;
  if (_id) {
    const res = await updatePage(toRaw(pageConfig));
    if (res.code === 0) {
      message.success('保存成功！');
    }
  } else {
    const res = await addPage<Page>(toRaw({ ...resConfig }));
    if (res.code === 0) {
      message.success('创建成功！');
      pageConfig._id = res.data._id;
      router.push(`/editor/${res.data._id}`);
    }
  }
};

const wrapScale = (size: number, isMultiply = false) => {
  const percent = pageConfig.scale / 100;
  const result = isMultiply ? size * percent : size / percent;
  return Math.floor(result);
};

export { pageConfig, setPageConfig, savePage, wrapScale };

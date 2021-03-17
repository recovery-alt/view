import { reactive, onMounted, toRaw } from 'vue';
import { addPage, getPage, updatePage } from '@/api';
import { Store } from 'vuex';
import { BoardEnum } from '@/store';
import { cloneDeep } from 'lodash';
import { message } from 'ant-design-vue';
import config from '@/config';
import { Router } from 'vue-router';

const pageConfig = reactive<Page>({
  _id: '',
  ...config.defaultBoardSize,
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

const usePage = (store: Store<RootStateType>, router: Router, id?: string) => {
  const savePage = async () => {
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

  onMounted(async () => {
    if (!id) return;
    const res = await getPage<Page>(id);
    if (res.code !== 0) return;
    Object.assign(pageConfig, res.data);
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { _id, config, ...remain } = res.data;
    setPageConfig(remain);
    store.dispatch(BoardEnum.SET_BOARD, { data: cloneDeep(config), selected: [] });
  });

  return { savePage };
};

export { pageConfig, usePage };

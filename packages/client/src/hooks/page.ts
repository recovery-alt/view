import { reactive, ref, onMounted, toRaw, watchEffect } from 'vue';
import { addPage, getPage, updatePage } from '@/api';
import { Store } from 'vuex';
import { BoardEnum } from '@/store';
import { cloneDeep } from 'lodash';
import { message } from 'ant-design-vue';
import config from '@/config';
import { Router } from 'vue-router';
import { useForm } from '@ant-design-vue/use';

const pageConfig = reactive<Page>({
  _id: '',
  ...config.defaultBoardSize,
  title: '',
  description: '',
  bgColor: '',
  author: '',
  pageMode: 0,
  config: [],
});

const setPageConfig = async (config: PageConfig) => {
  Object.assign(pageConfig, config);
};

const usePageConfig = () => {
  const showPageConfig = ref(false);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { _id, config, ...page } = pageConfig;
  const form = reactive({ ...page });
  const rules = reactive({
    title: [{ required: true, message: '标题为必填项' }],
    width: [{ required: true, message: '页面宽为必填项' }],
    height: [{ required: true, message: '页面高为必填项' }],
  });

  const { resetFields, validate, validateInfos } = useForm(form, rules);

  const savePageConfig = async () => {
    setPageConfig(form);
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { config, ...page } = pageConfig;
    const res = await updatePage({ ...page });
    if (res.code === 0) {
      message.success('更新成功！');
      showPageConfig.value = false;
    } else {
      message.error('更新失败！');
    }
  };

  watchEffect(() => {
    showPageConfig.value && Object.assign(form, pageConfig);
  });

  return { pageConfig, showPageConfig, form, resetFields, validate, validateInfos, savePageConfig };
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

export { pageConfig, usePage, usePageConfig };

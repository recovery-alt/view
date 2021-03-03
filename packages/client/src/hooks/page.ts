import { ref, onMounted, toRaw } from 'vue';
import { addPage, getPage, updatePage } from '@/api';
import { headSize, setHeadSize } from '@/hooks';
import { Store } from 'vuex';
import { BoardEnum } from '@/store/modules/board';
import { cloneDeep } from 'lodash';
import { message } from 'ant-design-vue';

const cachePage = ref<Partial<Page>>({});

const loadPage = (store: Store<RootStateType>, id?: string) => {
  onMounted(async () => {
    if (!id) return;
    const res = await getPage<Page>(id);
    if (res.code !== 0) return;
    cachePage.value = res.data;
    const { width, height, config } = res.data;
    setHeadSize(width, height);
    store.dispatch(BoardEnum.SET_BOARD, { data: cloneDeep(config), selected: [] });
  });
};

const savePage = async (store: Store<RootStateType>) => {
  const { board } = store.state;
  if (board.data.length === 0) {
    message.error('尚未添加任何组件！');
    return;
  }
  const title = '标题';
  const description = '描述';
  const author = '作者';
  const pageMode = 0;
  const config = toRaw(board.data);
  const { _id } = cachePage.value;
  const savePage = _id ? updatePage : addPage;
  const res = await savePage({
    _id,
    title,
    description,
    author,
    pageMode,
    config,
    ...toRaw(headSize),
  });
  if (res.code === 0) {
    message.success('保存成功！');
  }
};

export { cachePage, loadPage, savePage };

import { defineStore } from 'pinia';
import type { Page, PageConfig } from '@/typings';
import config from '@/config';
import { useBoardStore } from './board';
import cloneDeep from 'lodash/cloneDeep';
import { toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { addPage, updatePage } from '@/api';

export const usePageStore = defineStore('page', {
  state() {
    const initConfig = {
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
    };

    const state = {
      config: initConfig,
      cache: { ...initConfig, components: [] },
    } as { config: PageConfig; cache: Page };

    return state;
  },
  actions: {
    updateCache() {
      const board = useBoardStore();
      Object.assign(this.cache, this.config);
      this.cache.components = cloneDeep(toRaw(board.data));
    },
    async savePage() {
      const board = useBoardStore();
      const router = useRouter();
      if (board.data.length === 0) {
        message.error('尚未添加任何组件！');
        return;
      }
      // TODO: 校验表单
      const components = cloneDeep(toRaw(board.data));
      const page: Page = { components, ...this.config };
      const { _id, ...resConfig } = page;
      if (_id) {
        const res = await updatePage(toRaw(page));
        if (res.code === 0) {
          message.success('保存成功！');
          this.updateCache();
        }
      } else {
        const res = await addPage<Page>({ ...resConfig });
        if (res.code === 0) {
          message.success('创建成功！');
          this.config._id = res.data._id;
          this.updateCache();
          router.push(`/editor/${res.data._id}`);
        }
      }
    },
    isModified() {
      const board = useBoardStore();
      const now = { ...this.config, components: toRaw(board.data) };
      return JSON.stringify(now) !== JSON.stringify(this.cache);
    },
  },
});

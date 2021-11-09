import { defineStore } from 'pinia';
import type { Snapshot, Page } from '@/typings';
import cloneDeep from 'lodash/cloneDeep';
import config from '@/config';
import { message } from 'ant-design-vue';
import { useBoardStore } from './board';
import { usePageStore } from './page';

export const useSnapshotStore = defineStore('snapshot', {
  state: () => {
    const state: Snapshot = { data: [], index: -1 };
    return state;
  },
  actions: {
    undo() {
      if (this.index > -1) {
        this.index--;
        const snapshot = this.index === -1 ? undefined : cloneDeep(this.data[this.index]);
        if (snapshot) {
          const { selected, page } = snapshot;
          const { components: data } = page;
          const board = useBoardStore();
          board.setBoard({ selected, data });
        }
      }
    },
    redo() {
      if (this.index < this.data.length - 1) {
        this.index++;
        const board = useBoardStore();
        const snapshot = cloneDeep(this.data[this.index]);
        const { selected, page } = snapshot;
        const { components: data } = page;
        board.setBoard({ selected, data });
      }
    },
    rawRecordSnapshot(page: Page, selected: number[]) {
      // TODO
      this.data[++this.index] = { page, selected };
      if (this.index < this.data.length - 1) {
        this.data = this.data.slice(0, this.index + 1);
      }
      // 最大记录步数
      if (this.data.length > config.maxSnapshot) {
        this.data.shift();
      }
      message.success('保存成功！');
    },
    recordSnapshot() {
      const page = usePageStore();
      const board = useBoardStore();
      const { data, selected } = board;
      const components = cloneDeep(data);
      const newPage: Page = { ...page.config, components };
      this.rawRecordSnapshot(newPage, selected);
    },
  },
});

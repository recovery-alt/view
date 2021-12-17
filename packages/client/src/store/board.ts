import { defineStore } from 'pinia';
import type { Board, BoardState, Component, CSSStyleDataWithSize } from '@/typings';
import { spliceItems } from '@/utils';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuid } from 'uuid';
import config from '@/config';
import { nextTick } from 'vue';
import { useEchartsResize } from '@/components/board/hooks/board';
import { message } from 'ant-design-vue';
import { useGalleryStore } from './gallery';

export const useBoardStore = defineStore('board', {
  state: () => {
    const state: BoardState = { selected: [], data: [], refs: [], offset: { left: 0, top: 0 } };
    return state;
  },
  getters: {
    curCom(state) {
      return state.selected.length > 0 ? state.data[state.selected[0]] : void 0;
    },
    curComs(state) {
      return state.selected.map(index => state.data[index]);
    },
  },
  actions: {
    rawAppend(component: Component | Array<Component>) {
      const componentArr: Array<Component> = [];
      const selected: Array<number> = [];
      if (Array.isArray(component)) {
        component.forEach((val, i) => {
          componentArr.push(val);
          selected.push(this.data.length + i);
        });
      } else {
        componentArr.push(component);
        selected.push(this.data.length);
      }
      this.data.push(...componentArr);
      this.selected = selected;
    },
    append({ top = 0, left = 0, type = '', label = '' }) {
      const gallery = useGalleryStore();
      const cloneGallery = gallery.getGallery(type);
      if (!cloneGallery) throw new Error('获取不到该组件信息');
      const { style: defaultStyle, data, propsData } = cloneDeep(cloneGallery);
      const rotate = 0;
      const opacity = 1;
      const component = type;
      const id = uuid();
      const style = {
        top,
        left,
        rotate,
        opacity,
        ...config.defaultComponentSize,
        ...defaultStyle,
      };
      const mergedLabel = label || cloneGallery.name;
      this.rawAppend({ id, component, label: mergedLabel, propsData, style, data });
    },
    del() {
      if (this.selected.length > 0) {
        spliceItems(this.data, this.selected);
        this.selected = [];
        message.success('删除成功！');
      }
    },
    cancelSelected() {
      this.selected = [];
    },
    setIndex(rawSelected: Array<number> | number) {
      const selected = typeof rawSelected === 'number' ? [rawSelected] : rawSelected;
      const result: number[] = [];
      const { data } = this;
      selected.forEach(i => {
        if (!data[i].locked && data[i].style.display !== 'none') result.push(i);
      });
      this.selected = result;
    },
    spliceSelected(selected: number) {
      this.selected.splice(this.selected.indexOf(selected), 1);
    },
    appendSelected(selected: number | Array<number>) {
      const { data } = this;
      const selectedArr = typeof selected === 'number' ? [selected] : selected;
      const result: number[] = [];
      selectedArr.forEach(i => {
        if (!data[i].locked && data[i].style.display !== 'none') result.push(i);
      });
      this.selected.push(...result);
    },
    changeSelected(index: number) {
      const exist = this.selected.includes(index);
      exist ? this.spliceSelected(index) : this.appendSelected(index);
    },
    setBoard(board?: Board) {
      if (board) {
        Object.assign(this, board);
      } else {
        this.data = [];
        this.selected = [];
      }
      nextTick(() => {
        const { handleAllEchartsResize } = useEchartsResize();
        handleAllEchartsResize(this);
      });
    },
    copy() {
      if (this.selected.length > 0) {
        const newBoards = this.selected.map(index => {
          const newBoard = cloneDeep(this.data[index]);
          newBoard.style.left += 10;
          newBoard.style.top += 10;
          return newBoard;
        });
        this.rawAppend(newBoards);
      }
    },
    moveUp(moveTop = false) {
      const { data, selected } = this;
      const len = data.length;
      if (selected.length === 0) return;
      if (selected.length > 1) {
        message.error('多选无法移动');
      } else if (selected[0] === len - 1) {
        message.error('已经是最顶层！');
      } else {
        const exchangeIndex = moveTop ? len - 1 : selected[0] + 1;
        [data[selected[0]], data[exchangeIndex]] = [data[exchangeIndex], data[selected[0]]];
        this.selected = selected.map(index => len - index - 1);
      }
    },
    moveDown(moveBottom = false) {
      const { data, selected } = this;
      const len = data.length;
      if (selected.length === 0) {
        return;
      } else if (selected.length > 1) {
        message.error('多选无法移动');
      } else if (selected[0] === 0) {
        message.error('已经是最底层！');
      } else {
        const exchangeIndex = moveBottom ? 0 : selected[0] - 1;
        [data[selected[0]], data[exchangeIndex]] = [data[exchangeIndex], data[selected[0]]];
        this.selected = selected.map(index => len - index - 1);
      }
    },
    // 根据矩形计算选中的组件
    calcSelectedByRect(size: CSSStyleDataWithSize) {
      this.cancelSelected();
      const needSelected: Array<number> = [];
      this.data.forEach((component, index) => {
        const { width, height, left, top } = component.style;
        const minX = Math.min(left, size.left);
        const minY = Math.min(top, size.top);
        const maxX = Math.max(left + width, size.left + size.width);
        const maxY = Math.max(top + height, size.top + size.height);
        const rectWidth = maxX - minX;
        const rectheight = maxY - minY;
        if (rectWidth < width + size.width && rectheight < height + size.height) {
          needSelected.push(index);
        }
      });
      this.setIndex(needSelected);
    },
    group() {
      const { selected, data } = this;
      const components = spliceItems(data, selected);
      const position = components.reduce(
        (acc, val) => {
          const { left, top, width, height } = val.style;
          return {
            leftX: Math.min(acc.leftX, left),
            leftY: Math.min(acc.leftY, top),
            rightX: Math.max(acc.rightX, width + left),
            rightY: Math.max(acc.rightY, height + top),
          };
        },
        { leftX: Infinity, leftY: Infinity, rightX: 0, rightY: 0 }
      );
      const { leftX: left, leftY: top, rightX, rightY } = position;

      components.forEach(component => {
        component.style.top -= top;
        component.style.left -= left;
      });

      const width = rightX - left;
      const height = rightY - top;

      const group: Component = {
        id: uuid(),
        component: 'group',
        label: '成组',
        group: components,
        style: { top, left, width, height, rotate: 0, opacity: 1 },
      };

      // 取消原先选中
      selected.length = 0;
      this.rawAppend(group);
    },
    cancelGroup() {
      const { selected, data } = this;
      const component = data[selected[0]];
      data.splice(selected[0], 1);
      const group = component.group;
      if (!group) return;
      const { left, top } = component.style;
      const components: Component[] = [];
      group.forEach(component => {
        component.style.left += left;
        component.style.top += top;
        components.push(component);
      });
      this.rawAppend(components);
    },
    toggleLocked(target: number | Array<number>) {
      const { data, selected } = this;
      const targetArr = typeof target === 'number' ? [target] : [...target];
      targetArr.forEach(index => {
        const component = data[index];
        const i = selected.indexOf(index);
        component.locked = !component.locked;
        if (component.locked && i > -1) {
          selected.splice(i, 1);
        }
      });
    },
    hide(target: number | Array<number>) {
      const { data, selected } = this;
      const targetArr = typeof target === 'number' ? [target] : [...target];
      targetArr.forEach(index => {
        data[index].style.display = 'none';
        const i = selected.indexOf(index);
        if (i > -1) selected.splice(i, 1);
      });
    },
    show(target: number) {
      this.data[target].style.display = 'block';
    },
    selectAll() {
      const { data } = this;
      this.selected = data.map((_, i) => i);
    },
    clearRefs() {
      this.refs.length = 0;
    },
    setOffset(offset: BoardState['offset']) {
      this.offset = offset;
    },
    pushRef(ref: HTMLElement) {
      this.refs.push(ref);
    },
  },
});

import { Module, Mutation, Action } from 'vuex';
import { cloneDeep } from 'lodash';
import { getGalleryList } from '@/gallery';
import { message } from 'ant-design-vue';
import config from '@/config';
import { useBoardRefs } from '@/hooks';
import { nextTick } from 'vue';
import { v4 as uuid } from 'uuid';
import { spliceItems } from '@/utils';

const state: Board = {
  selected: [],
  data: [],
};

const mutations: Data<Mutation<Board>> = {
  append(state, component: Component | Array<Component>) {
    const componentArr: Array<Component> = [];
    const selected: Array<number> = [];
    if (Array.isArray(component)) {
      component.forEach((val, i) => {
        componentArr.push(val);
        selected.push(state.data.length + i);
      });
    } else {
      componentArr.push(component);
      selected.push(state.data.length);
    }
    state.data.push(...componentArr);
    state.selected = selected;
  },
  del(state) {
    spliceItems(state.data, state.selected);
    state.selected = [];
  },
  cancelSelected(state) {
    state.selected = [];
  },
  setIndex(state, selected: Array<number>) {
    const result: number[] = [];
    const { data } = state;
    selected.forEach(i => {
      if (!data[i].locked && data[i].style.display !== 'none') result.push(i);
    });
    state.selected = result;
  },
  appendSelected(state, selected: number | Array<number>) {
    const { data } = state;
    const selectedArr = typeof selected === 'number' ? [selected] : selected;
    const result: number[] = [];
    selectedArr.forEach(i => {
      if (!data[i].locked && data[i].style.display !== 'none') result.push(i);
    });
    state.selected.push(...result);
  },
  spliceSelected(state, selected: number) {
    state.selected.splice(state.selected.indexOf(selected), 1);
  },
  setBoard(state, board: Board | null) {
    if (board) {
      Object.assign(state, board);
    } else {
      state.data = [];
      state.selected = [];
    }
  },
  toggleLocked(state, target: number | Array<number>) {
    const { data, selected } = state;
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
  hide(state, target: number | Array<number>) {
    const { data, selected } = state;
    const targetArr = typeof target === 'number' ? [target] : [...target];
    targetArr.forEach(index => {
      data[index].style.display = 'none';
      const i = selected.indexOf(index);
      if (i > -1) selected.splice(i, 1);
    });
  },
  show(state, target: number) {
    state.data[target].style.display = 'block';
  },
  selectAll(state) {
    const { data } = state;
    state.selected = data.map((component, i) => i);
  },
};

const actions: Data<Action<Board, RootStateType>> = {
  append({ commit }, { top = 0, left = 0, type = 'area' }) {
    const gallery = getGalleryList();
    const componentConfig = gallery.find(val => val.type === type);
    if (!componentConfig) throw new Error('获取不到该组件信息');
    const { dataConfig, defaultStyle, defaultData } = componentConfig;
    const rotate = 0;
    const opacity = 1;
    const component = `cq-${type}`;
    const id = uuid();
    const style = {
      top,
      left,
      rotate,
      opacity,
      ...config.defaultComponentSize,
      ...defaultStyle,
    };
    const label = componentConfig.name;
    commit('append', { id, dataConfig, dataset: defaultData, label, component, style });
  },
  del({ state, commit }) {
    if (state.selected.length > 0) {
      commit('del');
      message.success('删除成功！');
    }
  },
  cancelSelected({ commit }) {
    commit('cancelSelected');
  },
  setIndex({ commit }, selected: Array<number> | number) {
    commit('setIndex', typeof selected === 'number' ? [selected] : selected);
  },
  changeSelected({ state, commit }, index: number) {
    const exist = state.selected.includes(index);
    const mutation = exist ? 'spliceSelected' : 'appendSelected';
    commit(mutation, index);
  },
  setBoard({ commit, state }, board: Board | null) {
    commit('setBoard', board);
    nextTick(() => {
      const { handleAllEchartsResize } = useBoardRefs();
      handleAllEchartsResize(state);
    });
  },
  copy({ commit, state }) {
    if (state.selected.length > 0) {
      const newBoards = state.selected.map(index => {
        const newBoard = cloneDeep(state.data[index]);
        newBoard.style.left += 10;
        newBoard.style.top += 10;
        return newBoard;
      });
      commit('append', newBoards);
    }
  },
  moveUp({ state }, moveTop = false) {
    const { data, selected } = state;
    const len = data.length;
    if (selected.length === 0) {
      return;
    } else if (selected.length > 1) {
      message.error('多选无法移动');
    } else if (selected[0] === len - 1) {
      message.error('已经是最顶层！');
    } else {
      const exchangeIndex = moveTop ? len - 1 : selected[0] + 1;
      [data[selected[0]], data[exchangeIndex]] = [data[exchangeIndex], data[selected[0]]];
    }
  },
  moveDown({ state }, moveBottom = false) {
    const { data, selected } = state;
    if (selected.length === 0) {
      return;
    } else if (selected.length > 1) {
      message.error('多选无法移动');
    } else if (selected[0] === 0) {
      message.error('已经是最底层！');
    } else {
      const exchangeIndex = moveBottom ? 0 : selected[0] - 1;
      [data[selected[0]], data[exchangeIndex]] = [data[exchangeIndex], data[selected[0]]];
    }
  },
  // 根据矩形计算选中的组件
  calcSelectedByRect({ state, commit }, size: CSSStyleDataWithSize) {
    commit('cancelSelected');
    const needSelected: Array<number> = [];
    state.data.forEach((component, index) => {
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
    commit('setIndex', needSelected);
  },
  group({ state, commit }) {
    const { selected, data } = state;
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
      component: 'cq-group',
      label: '成组',
      group: components,
      style: { top, left, width, height, rotate: 0, opacity: 1 },
    };

    // 取消原先选中
    selected.length = 0;
    commit('append', group);
  },
  cancelGroup({ state, commit }) {
    const { selected, data } = state;
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
    commit('append', components);
  },
  toggleLocked({ commit }, target: number | Array<number>) {
    commit('toggleLocked', target);
  },
  hide({ commit }, target: number | Array<number>) {
    commit('hide', target);
  },
  show({ commit }, target: number) {
    commit('show', target);
  },
  selectAll({ commit }) {
    commit('selectAll');
  },
};

const board: Module<Board, RootStateType> = {
  state,
  mutations,
  actions,
  namespaced: true,
};

enum BoardEnum {
  APEEND = 'board/append',
  DEL = 'board/del',
  SET_INDEX = 'board/setIndex',
  CANCEL_SELECTED = 'board/cancelSelected',
  CHANGE_SELECTED = 'board/changeSelected',
  SET_BOARD = 'board/setBoard',
  COPY = 'board/copy',
  MOVE_UP = 'board/moveUp',
  MOVE_DOWN = 'board/moveDown',
  CALC_SELECTED_BY_RECT = 'board/calcSelectedByRect',
  GROUP = 'board/group',
  CANCEL_GROUP = 'board/cancelGroup',
  TOGGLE_LOCKED = 'board/toggleLocked',
  HIDE = 'board/hide',
  SHOW = 'board/show',
  SELECT_ALL = 'board/selectAll',
}

export { board, BoardEnum };

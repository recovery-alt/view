import { Module, Mutation, Action } from 'vuex';
import { cloneDeep } from 'lodash';
import { SnapshotEnum } from './snapshot';
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
    state.selected = selected;
  },
  appendSelected(state, selected: number | Array<number>) {
    const selectedArr = typeof selected === 'number' ? [selected] : selected;
    state.selected.push(...selectedArr);
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
  setCopy(state) {
    state.copy = cloneDeep(state.selected.map(index => state.data[index]));
  },
};

const actions: Data<Action<Board, RootStateType>> = {
  append({ commit, dispatch }, { top = 0, left = 0, type = 'area' }) {
    const rotate = 0;
    const style = { top, left, rotate, ...config.defaultComponentSize };
    const component = `cq-${type}`;
    // const attr = presetComponentAttr;
    const id = uuid();
    const gallery = getGalleryList();
    const componentConfig = gallery.find(val => val.type === type);
    if (!componentConfig) throw new Error('获取不到组件配置');
    const label = componentConfig.type;
    commit('append', { id, label, component, style });
    dispatch(SnapshotEnum.RECORD_SNAPSHOT, null, { root: true });
  },
  del({ state, commit, dispatch }) {
    if (state.selected.length > 0) {
      commit('del');
      dispatch(SnapshotEnum.RECORD_SNAPSHOT, null, { root: true });
      message.success('删除成功！');
    } else {
      message.error('尚未选中任何组件！');
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
  cut({ state, commit, dispatch }) {
    if (state.selected.length > 0) {
      commit('setCopy');
      commit('del');
      dispatch(SnapshotEnum.RECORD_SNAPSHOT, null, { root: true });
      message.success('剪切成功！');
    } else {
      message.error('尚未选中任何组件！');
    }
  },
  copy({ commit }) {
    if (state.selected.length > 0) {
      commit('setCopy');
      message.success('复制成功！');
    } else {
      message.error('尚未选中任何组件！');
    }
  },
  paste({ commit, state, dispatch }, position: { top: number; left: number }) {
    if (state.copy) {
      const minPos = state.copy.reduce(
        (acc, val) => ({
          left: Math.min(acc.left, val.style.left),
          top: Math.min(acc.left, val.style.left),
        }),
        { left: Infinity, top: Infinity }
      );

      const diffX = position.left - minPos.left;
      const diffY = position.top - minPos.top;

      const newCopy = cloneDeep(state.copy).map(val => {
        val.id = uuid();
        val.style.left += diffX;
        val.style.top += diffY;
        return val;
      });
      commit('append', newCopy);
      dispatch(SnapshotEnum.RECORD_SNAPSHOT, null, { root: true });
    } else {
      message.error('请先进行剪切/复制操作！');
    }
  },
  moveUp({ state, dispatch }, moveTop = false) {
    const { data, selected } = state;
    const len = data.length;
    if (selected.length === 0) {
      message.error('尚未选中任何组件！');
    } else if (selected.length > 1) {
      message.error('多选无法移动');
    } else if (selected[0] === len - 1) {
      message.error('已经是最顶层！');
    } else {
      const exchangeIndex = moveTop ? len - 1 : selected[0] + 1;
      [data[selected[0]], data[exchangeIndex]] = [data[exchangeIndex], data[selected[0]]];
      dispatch(SnapshotEnum.RECORD_SNAPSHOT, null, { root: true });
    }
  },
  moveDown({ state, dispatch }, moveBottom = false) {
    const { data, selected } = state;
    if (selected.length === 0) {
      message.error('尚未选中任何组件！');
    } else if (selected.length > 1) {
      message.error('多选无法移动');
    } else if (selected[0] === 0) {
      message.error('已经是最底层！');
    } else {
      const exchangeIndex = moveBottom ? 0 : selected[0] - 1;
      [data[selected[0]], data[exchangeIndex]] = [data[exchangeIndex], data[selected[0]]];
      dispatch(SnapshotEnum.RECORD_SNAPSHOT, null, { root: true });
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
      style: { top, left, width, height, rotate: 0 },
    };
    commit('append', group);
  },
  cancelGroup({ state, commit }) {
    const { selected, data } = state;
    const component = data[selected[0]];
    data.splice(selected[0], 1);
    const group = component.group as Component[];
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
  CUT = 'board/cut',
  COPY = 'board/copy',
  PASTE = 'board/paste',
  MOVE_UP = 'board/moveUp',
  MOVE_DOWN = 'board/moveDown',
  CALC_SELECTED_BY_RECT = 'board/calcSelectedByRect',
  GROUP = 'board/group',
  CANCEL_GROUP = 'board/cancelGroup',
}

export { board, BoardEnum };

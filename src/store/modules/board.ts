import { Module, Mutation, Action } from 'vuex';
import { cloneDeep, uniqueId } from 'lodash';
import { SnapshotEnum } from './snapshot';
import { defaultComponentSize, presetComponentAttr } from '@/options';
import { getGalleryList } from '@/gallery';
import { ElMessage } from 'element-plus';

const state: Board = {
  index: -1,
  data: [],
};

const mutations: Data<Mutation<Board>> = {
  append(state, component: Component) {
    state.data.push(component);
    state.index = state.data.length - 1;
  },
  del(state, index: number) {
    state.data.splice(index, 1);
    state.index = -1;
  },
  cancelSelected(state) {
    state.index = -1;
  },
  setIndex(state, index: number) {
    state.index = index;
  },
  setBoard(state, board: Board | null) {
    if (board) {
      Object.assign(state, board);
    } else {
      state.data = [];
      state.index = -1;
    }
  },
  setCopy(state) {
    state.copy = cloneDeep(state.data[state.index]);
  },
};

const actions: Data<Action<Board, RootStateType>> = {
  append({ state, commit, dispatch }, { top = 0, left = 0, type = 'text' }) {
    const style = { top, left, ...defaultComponentSize };
    const component = `v-${type}`;
    const attr = presetComponentAttr;
    const id = uniqueId();
    const gallery = getGalleryList();
    const componentConfig = gallery.find(val => val.type === type);
    if (!componentConfig) throw new Error('获取不到组件配置');
    const label = componentConfig.name;
    commit('append', { id, label, component, attr, style });
    dispatch(SnapshotEnum.RECORD_SNAPSHOT, state, { root: true });
  },
  del({ state, commit }) {
    if (state.index > -1) {
      commit('del');
      ElMessage.success('删除成功！');
    } else {
      ElMessage.error('尚未选中任何组件！');
    }
  },
  cancelSelected({ commit }) {
    commit('cancelSelected');
  },
  setIndex({ commit }, index: number) {
    commit('setIndex', index);
  },
  setBoard({ commit }, board: Board | null) {
    commit('setBoard', board);
  },
  cut({ state, commit }) {
    if (state.index > -1) {
      commit('setCopy');
      commit('del');
      ElMessage.success('剪切成功！');
    } else {
      ElMessage.error('尚未选中任何组件！');
    }
  },
  copy({ commit }) {
    if (state.index > -1) {
      commit('setCopy');
      ElMessage.success('复制成功！');
    } else {
      ElMessage.error('尚未选中任何组件！');
    }
  },
  paste({ commit, state }, position) {
    if (state.copy) {
      state.copy.id = uniqueId();
      Object.assign(state.copy.style, position);
      commit('append', cloneDeep(state.copy));
    } else {
      ElMessage.error('请先进行剪切/复制操作！');
    }
  },
};

const board: Module<Board, RootStateType> = {
  state,
  mutations,
  actions,
  namespaced: true,
};

export enum BoardEnum {
  APEEND = 'board/append',
  DEL = 'board/del',
  CANCEL_SELECTED = 'board/cancelSelected',
  SET_INDEX = 'board/setIndex',
  SET_BOARD = 'board/setBoard',
  CUT = 'board/cut',
  COPY = 'board/copy',
  PASTE = 'board/paste',
}

export default board;

import { Module, Mutation, Getter, Action } from 'vuex';
import { cloneDeep } from 'lodash';
import { BoardEnum } from './board';

const state: Snapshot = {
  data: [],
  index: 0,
};

const getters: Data<Getter<Snapshot, RootStateType>> = {};

const mutations: Data<Mutation<Snapshot>> = {
  pushSnapshot(state, board: Board) {
    state.data[++state.index] = cloneDeep(board);
    if (state.index < state.data.length - 1) {
      state.data = state.data.slice(0, state.index + 1);
    }
  },
};

const actions: Data<Action<Snapshot, RootStateType>> = {
  undo({ commit, state }) {
    if (state.index > -1) {
      state.index--;
      commit(BoardEnum.SET_BOARD, cloneDeep(state.data[state.index]));
    }
  },
  redo({ commit, state }) {
    if (state.index < state.data.length - 1) {
      state.index++;
      commit(BoardEnum.SET_BOARD, cloneDeep(state.data[state.index]));
    }
  },
};

const snapshot: Module<Snapshot, RootStateType> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};

export enum SnapshotEnum {
  PUSH_SNAPSHOT = 'snapshot/pushSnapshot',
  UNDO = 'snapshot/undo',
  REDO = 'snapshot/redo',
}

export default snapshot;

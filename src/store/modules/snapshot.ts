import { Module, Mutation, Action } from 'vuex';
import { cloneDeep } from 'lodash';
import { BoardEnum } from './board';

const state: Snapshot = {
  data: [],
  index: -1,
};

const mutations: Data<Mutation<Snapshot>> = {
  recordSnapshot(state, board: Board) {
    state.data[++state.index] = cloneDeep(board);
    if (state.index < state.data.length - 1) {
      state.data = state.data.slice(0, state.index + 1);
    }
  },
};

const actions: Data<Action<Snapshot, RootStateType>> = {
  undo({ dispatch, state }) {
    if (state.index > -1) {
      state.index--;
      const board = state.index === -1 ? null : cloneDeep(state.data[state.index]);
      dispatch(BoardEnum.SET_BOARD, board, {
        root: true,
      });
    }
  },
  redo({ dispatch, state }) {
    if (state.index < state.data.length - 1) {
      state.index++;
      dispatch(BoardEnum.SET_BOARD, cloneDeep(state.data[state.index]), { root: true });
    }
  },
  recordSnapshot({ rootState, commit }) {
    commit('recordSnapshot', rootState.board);
  },
};

const snapshot: Module<Snapshot, RootStateType> = {
  state,
  mutations,
  actions,
  namespaced: true,
};

export enum SnapshotEnum {
  RECORD_SNAPSHOT = 'snapshot/recordSnapshot',
  UNDO = 'snapshot/undo',
  REDO = 'snapshot/redo',
}

export default snapshot;

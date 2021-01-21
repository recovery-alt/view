import { Module, Mutation, Getter, Action } from 'vuex';
import { uniqueId } from 'lodash';
import { SnapshotEnum } from './snapshot';

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
};

const actions: Data<Action<Board, RootStateType>> = {
  append({ state, commit, dispatch }, component: Component) {
    commit('append', component);
    dispatch(SnapshotEnum.RECORD_SNAPSHOT, state, { root: true });
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
}

export default board;

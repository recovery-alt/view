import { Module, Mutation, Getter, Action } from 'vuex';
import { v4 } from 'uuid';
import { SnapshotEnum } from './snapshot';

const state: Board = {
  index: 0,
  data: [],
};

const getters: Data<Getter<Board, RootStateType>> = {
  getCurComponent(state) {
    return state.data[state.index];
  },
};

const mutations: Data<Mutation<Board>> = {
  append(state, component: Component) {
    component.id = v4();
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
  setBoard(state, board: Board) {
    Object.assign(state, board);
  },
};

const actions: Data<Action<Board, RootStateType>> = {
  append({ state, commit }, component: Component) {
    commit('append', component);
    commit(SnapshotEnum.PUSH_SNAPSHOT, state, { root: true });
  },
};

const board: Module<Board, RootStateType> = {
  state,
  getters,
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

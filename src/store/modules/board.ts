import { Module, Mutation, Getter, Action } from 'vuex';
import { v4 } from 'uuid';
import { SnapshotEnum } from './snapshot';
import { defaultStyleOption } from '@/options';

const state: Board = {
  index: -1,
  data: [],
};

const getters: Data<Getter<Board, RootStateType>> = {
  getCurComponent(state) {
    return state.data[state.index];
  },
  getBoard(state) {
    return state;
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
  GET_CUR_COMPONENT = 'board/getCurComponent',
  GET_BOARD = 'board/getBoard',
}

export default board;

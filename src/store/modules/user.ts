import { Module, Mutation } from 'vuex';
import rootState from '..';

const state = { count: 0 };

type stateType = typeof state;
type rootStateType = typeof rootState;

const mutations: Record<string, Mutation<stateType>> = {
  plus(state) {
    state.count++;
  },
};

const user: Module<stateType, rootStateType> = {
  namespaced: true,
  state,
  mutations,
};

export default user;

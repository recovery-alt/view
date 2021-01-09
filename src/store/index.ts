import { createStore, ModuleTree } from 'vuex';
const context = require.context('./modules/', true, /\.ts$/);
const modules: ModuleTree<{}> = {};

context.keys().forEach(key => {
  const matcher = key.match(/\/([\w-]+)\.ts/);
  const resultKey = matcher && matcher[1];
  if (resultKey) {
    modules[resultKey] = context(key).default;
  }
});

export default createStore({
  modules,
  state: {},
  mutations: {},
  actions: {},
});

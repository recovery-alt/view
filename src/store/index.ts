import { createStore, ModuleTree, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue';
const context = require.context('./modules/', true, /\.ts$/);
const modules: ModuleTree<{}> = {};

context.keys().forEach(key => {
  const matcher = key.match(/\/([\w-]+)\.ts/);
  const resultKey = matcher && matcher[1];
  if (resultKey) {
    modules[resultKey] = context(key).default;
  }
});

export const key: InjectionKey<Store<RootStateType>> = Symbol();

export const store = createStore({ modules });

export const useStore = () => baseUseStore(key);

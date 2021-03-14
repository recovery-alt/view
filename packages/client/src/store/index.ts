import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue';
import board from './modules/board';
import snapshot from './modules/snapshot';

export const key: InjectionKey<Store<RootStateType>> = Symbol();

export const store = createStore({ modules: { board, snapshot } });

export const useStore = () => baseUseStore(key);

export { BoardEnum } from './modules/board';

export { SnapshotEnum } from './modules/snapshot';

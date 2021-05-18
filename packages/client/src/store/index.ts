import type { RootStateType } from '@/typings';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue';
import { board, BoardEnum } from './modules/board';
import { snapshot, SnapshotEnum } from './modules/snapshot';

const key: InjectionKey<Store<RootStateType>> = Symbol();

const store = createStore({ modules: { board, snapshot } });

const useStore = () => baseUseStore(key);

export { key, store, useStore, BoardEnum, SnapshotEnum };

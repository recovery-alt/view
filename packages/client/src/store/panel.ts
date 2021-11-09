import { defineStore } from 'pinia';

export type PanelKey = 'layer' | 'component' | 'config' | 'util';

export const usePanelStore = defineStore('panel', {
  state() {
    return { layer: true, component: true, config: true, util: true };
  },
  actions: {
    switchPanelShow(key: PanelKey) {
      this[key] = !this[key];
    },
  },
});

import type { Board, CSSStyleDataWithSize } from '@/typings';
import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export enum MenuEnum {
  BOARD = 'board',
  LAYER = 'layer',
}

export type Menu = {
  show: boolean;
  style: Partial<CSSStyleDataWithSize>;
  ref?: HTMLElement;
  container?: HTMLElement;
};

export const useMenuStore = defineStore('menu', {
  state() {
    const state = {
      board: {
        show: false,
        style: {},
      },
      layer: {
        show: false,
        style: {},
      },
    } as Record<MenuEnum, Menu>;

    return state;
  },
  actions: {
    show(e: MouseEvent, key: MenuEnum, board: Board) {
      e.preventDefault();
      const { pageX, pageY } = e;
      if (board.selected.length === 0) return;
      this[key].show = true;

      nextTick(() => {
        const { ref, container, style } = this[key];
        if (!ref || !container) return;
        const menuGap = 10;
        const { width, height } = ref.getBoundingClientRect();
        const { width: boxW, height: boxH, left, top } = container.getBoundingClientRect();
        style.left = Math.min(pageX - left, boxW - width - menuGap);
        style.top = Math.min(pageY - top, boxH - height - menuGap);
      });
    },
    hide(key: MenuEnum) {
      this[key].show = false;
    },
    hideAll() {
      Object.values(MenuEnum).forEach(key => {
        this.hide(key);
      });
    },
    setRefAndContainer(key: MenuEnum, ref?: HTMLElement, container?: HTMLElement) {
      this[key].ref = ref;
      this[key].container = container;
    },
  },
});

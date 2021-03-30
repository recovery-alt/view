import { local } from './storage';
import { LocalKeys } from '@/enum';

export const getBoardReletedPosition = (left: number, top: number, className = '.board') => {
  const boardDom = document.querySelector(className);
  if (!boardDom) return;
  const boardRec = boardDom.getBoundingClientRect();
  return { top: top - boardRec.top, left: left - boardRec.left };
};

export const getBoardMenuPosition = (className = '.board-menu') => {
  const menuDom = document.querySelector(className);
  if (!menuDom) return;
  const { top, left } = menuDom.getBoundingClientRect();
  return getBoardReletedPosition(left, top);
};

export const changeTheme = () => {
  const isDark = local.get(LocalKeys.IS_DARK);
  let theme;
  if (isDark) {
    theme = 'light';
    local.remove(LocalKeys.IS_DARK);
  } else {
    theme = 'dark';
    local.set(LocalKeys.IS_DARK, 1);
  }
  document.documentElement.setAttribute('theme', theme);
};

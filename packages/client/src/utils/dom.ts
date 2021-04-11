import { local } from './storage';
import { LocalKeys } from '@/enum';
import { theme } from '@/hooks';

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
  if (isDark) {
    theme.value = 'light';
    local.remove(LocalKeys.IS_DARK);
  } else {
    theme.value = 'dark';
    local.set(LocalKeys.IS_DARK, 1);
  }
  document.documentElement.setAttribute('theme', theme.value);
};

export const getCurrentCSSVar = (cssVar: string) =>
  window.getComputedStyle(document.documentElement).getPropertyValue(cssVar);

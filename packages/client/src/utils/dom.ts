import { wrapScale } from './number';

export const getBoardReletedPosition = (left: number, top: number, className = '.board') => {
  const boardDom = document.querySelector(className);
  if (!boardDom) return;
  const boardRec = boardDom.getBoundingClientRect();
  return { top: wrapScale(top - boardRec.top), left: wrapScale(left - boardRec.left) };
};

export const getCurrentCSSVar = (cssVar: string) =>
  window.getComputedStyle(document.documentElement).getPropertyValue(cssVar);

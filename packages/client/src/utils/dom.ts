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

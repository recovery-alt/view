export const getBoardReletedPosition = (left: number, top: number) => {
  const boardDom = document.querySelector('.board');
  if (!boardDom) return;
  const boardRec = boardDom.getBoundingClientRect();
  return { top: top - boardRec.top, left: left - boardRec.left };
};

export const getMenuPosition = () => {
  const menuDom = document.querySelector('.board-menu');
  if (!menuDom) return;
  const { top, left } = menuDom.getBoundingClientRect();
  return getBoardReletedPosition(left, top);
};

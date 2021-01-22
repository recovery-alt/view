export const getMenuPosition = () => {
  const menuDom = document.querySelector('.board-menu');
  const boardDom = document.querySelector('.board');
  if (!menuDom || !boardDom) return;
  const { top, left } = menuDom.getBoundingClientRect();
  const boardRec = boardDom.getBoundingClientRect();
  return { top: top - boardRec.top, left: left - boardRec.left };
};

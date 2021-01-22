import { nextTick, reactive } from 'vue';

type Menu = {
  show: boolean;
  style: CSSStyleData;
};

const menu = reactive<Menu>({
  show: false,
  style: {},
});

const setStyle = (style: CSSStyleData) => {
  menu.style = style;
};

const showMenu = (e: MouseEvent) => {
  const { pageX, pageY } = e;
  menu.show = true;
  nextTick(() => {
    const menuDom = document.querySelector('.board-menu');
    const boardDom = document.querySelector('.board');
    if (!menuDom || !boardDom) return;
    const menuGap = 10;
    const { width, height } = menuDom.getBoundingClientRect();
    const boardRec = boardDom.getBoundingClientRect();
    menu.style.left = Math.min(pageX - boardRec.left, boardRec.width - width - menuGap);
    menu.style.top = Math.min(pageY - boardRec.top, boardRec.height - height - menuGap);
  });
};

const hideMenu = () => {
  menu.show = false;
};

export { menu, setStyle, showMenu, hideMenu };

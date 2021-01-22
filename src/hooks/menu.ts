import { nextTick, reactive } from 'vue';

type Position = { top: number; left: number };

type Menu = {
  position: Position;
  show: boolean;
  style: Partial<CSSStyleDeclaration>;
};

const menu = reactive<Menu>({
  position: { top: 0, left: 0 },
  show: false,
  style: {},
});

const setStyle = (style: Partial<CSSStyleDeclaration>) => {
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
    menu.position.left = Math.min(pageX - boardRec.left, boardRec.width - width - menuGap);
    menu.position.top = Math.min(pageY - boardRec.top, boardRec.height - height - menuGap);
  });
};

const hideMenu = () => {
  menu.show = false;
};

const setPosition = (position: Position) => {
  menu.position = position;
};

export { menu, setStyle, showMenu, hideMenu, setPosition };

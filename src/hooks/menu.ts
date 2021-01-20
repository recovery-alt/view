import { nextTick, reactive } from 'vue';
import { headSize } from './head';

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
    const dom = document.querySelector('.board-menu');
    if (!dom) return;
    const menuGap = 10;
    const { width, height } = dom.getBoundingClientRect();
    menu.position.left = Math.min(pageX - 220, headSize.width - width - menuGap);
    menu.position.top = Math.min(pageY - 80, headSize.height - height - menuGap);
  });
};

const hideMenu = () => {
  menu.show = false;
};

const setPosition = (position: Position) => {
  menu.position = position;
};

export { menu, setStyle, showMenu, hideMenu, setPosition };

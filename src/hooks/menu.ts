import { reactive, ref } from 'vue';

type Position = { top: number; left: number };

type Menu = {
  position: Position;
  show: boolean;
  style: Partial<CSSStyleDeclaration>;
};

export const useMenu = () => {
  const menu = reactive<Menu>({
    position: { top: 0, left: 0 },
    show: false,
    style: {},
  });

  const setStyle = (style: Partial<CSSStyleDeclaration>) => {
    menu.style = style;
  };

  const showMenu = () => {
    menu.show = true;
  };

  const hideMenu = () => {
    menu.show = false;
  };

  const setPosition = (position: Position) => {
    menu.position = position;
  };

  return { menu, setStyle, showMenu, hideMenu, setPosition };
};

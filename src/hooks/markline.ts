import { reactive } from 'vue';

type Markline = {
  diff: number;
  lines: Array<{ name: string; show: boolean; style: Partial<CSSStyleDeclaration> }>;
};

const markline = reactive<Markline>({
  diff: 3,
  lines: [
    {
      name: 'x-top',
      show: false,
      style: {},
    },
    {
      name: 'x-mid',
      show: false,
      style: {},
    },
    {
      name: 'x-bottom',
      show: false,
      style: {},
    },
    {
      name: 'y-left',
      show: false,
      style: {},
    },
    {
      name: 'y-mid',
      show: false,
      style: {},
    },
    {
      name: 'y-right',
      show: false,
      style: {},
    },
  ],
});

const calcDistance = (num1: number, num2: number) => {
  return Math.abs(num1 - num2) < markline.diff;
};

const judgeLineShow = (board: Board, curComponent: Component) => {
  const { width: curWidth, height: curHeight, left: curLeft, top: curTop } = curComponent.position;
  const data = [...board.data];
  // 排除自己
  data.splice(board.index, 1);
  data.forEach(component => {
    const { width, height, left, top } = component.position;
    // x-top
    if (calcDistance(top, curTop)) {
      curComponent.position.top = top;
      markline.lines[0].show = true;
      markline.lines[0].style.top = top + 'px';
    } else {
      markline.lines[0].show = false;
    }
    // x-mid
    if (calcDistance(top + height / 2, curTop + curHeight / 2)) {
      curComponent.position.top = top + height / 2 - curHeight / 2;
      markline.lines[1].show = true;
      markline.lines[1].style.top = top + height / 2 + 'px';
    } else {
      markline.lines[1].show = false;
    }
    // x-bottom
    if (calcDistance(top + height, curTop + curHeight)) {
      curComponent.position.top = top + height - curHeight;
      markline.lines[2].show = true;
      markline.lines[2].style.top = top + height + 'px';
    } else {
      markline.lines[2].show = false;
    }

    // y-left
    if (calcDistance(left, curLeft)) {
      curComponent.position.left = left;
      markline.lines[3].show = true;
      markline.lines[3].style.left = left + 'px';
    } else {
      markline.lines[3].show = false;
    }

    // y-mid
    if (calcDistance(left + width / 2, curLeft + curWidth / 2)) {
      curComponent.position.left = left + width / 2 - curWidth / 2;
      markline.lines[4].show = true;
      markline.lines[4].style.left = left + width / 2 + 'px';
    } else {
      markline.lines[4].show = false;
    }

    // y-right
    if (calcDistance(left + width, curLeft + curWidth)) {
      curComponent.position.left = left + width - curWidth;
      markline.lines[5].show = true;
      markline.lines[5].style.left = left + width + 'px';
    } else {
      markline.lines[5].show = false;
    }
  });
};

export { markline, judgeLineShow };

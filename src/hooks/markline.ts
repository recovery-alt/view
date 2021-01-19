import { reactive } from 'vue';

type Line = { name: string; show: boolean; style: Partial<CSSStyleDeclaration> };

type Markline = {
  diff: number;
  lines: Array<Line>;
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

// 判断是否需要吸附
const judgeNeedSorption = (num1: number, num2: number) => {
  return Math.abs(num1 - num2) < markline.diff;
};

// 判断线是否需要显示
const judgeLineShow = (board: Board, curComponent: Component) => {
  const { width: curWidth, height: curHeight, left: curLeft, top: curTop } = curComponent.position;
  const data = [...board.data];
  // 排除自己
  data.splice(board.index, 1);
  // 遍历除自己外的所有组件
  data.forEach(component => {
    const { width, height, left, top } = component.position;
    // 遍历所有的markline
    markline.lines.forEach((line, lineIndex) => {
      const isX = line.name.includes('x');
      // 根据x/y轴判断所使用的遍历
      const key = isX ? 'top' : 'left';
      const [curPos, leftOrTop, widthOrHeight, curWidthOrHeight] = isX
        ? [curTop, top, height, curHeight]
        : [curLeft, left, width, curWidth];

      const remainder = lineIndex % 3;
      for (let i = 0; i < 3; i++) {
        // 线的位置
        const linePos = leftOrTop + (widthOrHeight * remainder) / 2;
        // 当前拖拽组件的高度/宽度差
        const delta = (curWidthOrHeight * i) / 2;
        const needSorption = judgeNeedSorption(curPos + delta, linePos);
        // 如果找到了就实现吸附
        if (needSorption) {
          curComponent.position[key] = linePos - delta;
          line.style[key] = linePos + 'px';
        }
        line.show = needSorption;
        // 匹配到了就直接不继续找了
        if (needSorption) break;
      }
    });
  });
};

const hideAllLines = () => {
  markline.lines.forEach(line => {
    line.show = false;
  });
};

export { markline, judgeLineShow, hideAllLines };

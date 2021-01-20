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
  for (let i = 0, len = data.length; i < len; i++) {
    const { width, height, left, top } = data[i].position;
    for (let k = 0; k < 3; k++) {
      // 遍历所有的markline
      for (let j = 0, len = markline.lines.length; j < len; j++) {
        const line = markline.lines[j];
        const isX = line.name.includes('x');
        // 根据x/y轴判断所使用的遍历
        const key = isX ? 'top' : 'left';
        const [curPos, leftOrTop, widthOrHeight, curWidthOrHeight] = isX
          ? [curTop, top, height, curHeight]
          : [curLeft, left, width, curWidth];

        const remainder = j % 3;

        // 线的位置
        const linePos = leftOrTop + (widthOrHeight * remainder) / 2;
        // 当前拖拽组件的高度/宽度差
        const delta = (curWidthOrHeight * k) / 2;
        const needSorption = judgeNeedSorption(curPos + delta, linePos);
        // 如果找到了就实现吸附
        if (needSorption) {
          curComponent.position[key] = linePos - delta;
          line.style[key] = linePos + 'px';
        }
        line.show = needSorption;
        // 匹配到了就直接不继续找了
        if (needSorption) return;
      }
    }
  }
};

const hideAllLines = () => {
  markline.lines.forEach(line => {
    line.show = false;
  });
};

export { markline, judgeLineShow, hideAllLines };

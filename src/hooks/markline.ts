import { reactive } from 'vue';

type Line = { name: string; show: boolean; style: CSSStyleData };

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

const hideAllLines = () => {
  markline.lines.forEach(line => {
    line.show = false;
  });
};

// 判断线是否需要显示
const judgeLineShow = (board: Board, curComponent: Component) => {
  const { width: curWidth, height: curHeight, left: curLeft, top: curTop } = curComponent.style;
  const data = [...board.data];
  // 排除自己
  data.splice(board.selected[0], 1);

  // 需要显示的线
  const needShow = [];

  // 上中下/左中右
  for (let i = 0; i < 3; i++) {
    // 遍历所有的markline
    for (let j = 0, len = markline.lines.length; j < len; j++) {
      let needSorption = false;
      const line = markline.lines[j];
      // 重置markline状态
      line.show = false;
      const isX = line.name.includes('x');
      const remainder = j % 3;
      // 根据x/y轴判断所使用的遍历
      const key = isX ? 'top' : 'left';
      // 遍历除自己外的所有组件
      for (let k = 0, len = data.length; k < len; k++) {
        const { width, height, left, top } = data[k].style;
        const [curPos, leftOrTop, widthOrHeight, curWidthOrHeight] = isX
          ? [curTop, top, height, curHeight]
          : [curLeft, left, width, curWidth];

        // 线的位置
        const linePos = leftOrTop + (widthOrHeight * remainder) / 2;
        // 当前拖拽组件的高度/宽度差
        const delta = (curWidthOrHeight * i) / 2;
        needSorption = judgeNeedSorption(curPos + delta, linePos);
        // 如果找到了就推到数组里，跳出循环
        if (needSorption) {
          curComponent.style[key] = linePos - delta;
          line.style[key] = linePos;
          needShow.push(j);
          break;
        }
      }
    }
  }

  // 需要显示的数据统一设置显示
  needShow.forEach(val => {
    markline.lines[val].show = true;
  });
};

export { markline, judgeLineShow, hideAllLines };

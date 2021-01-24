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
const judgeLineShow = (board: Board, curComponents: Array<Component>) => {
  // 缓存初始选中组件的值
  const curPositions = curComponents.map(component => {
    const { width, height, left, top } = component.style;
    return { width, height, left, top };
  });

  // 需要显示的线
  const needShow = [];

  // 上中下/左中右
  for (let i = 0; i < 3; i++) {
    // 遍历所有的markline
    for (let j = 0, len = markline.lines.length; j < len; j++) {
      const line = markline.lines[j];
      // 重置markline状态
      line.show = false;
      const isX = line.name.includes('x');
      const remainder = j % 3;
      // 根据x/y轴判断所使用的遍历
      const key = isX ? 'top' : 'left';
      // 遍历除自己外的所有组件
      for (let m = 0, len = board.data.length; m < len; m++) {
        if (curComponents.includes(board.data[m])) continue;
        const { width, height, left, top } = board.data[m].style;
        let needSorption = false;
        // 遍历所有选中的组件
        for (let n = 0, len = curPositions.length; n < len; n++) {
          const curPosition = curPositions[n];
          const [curPos, leftOrTop, widthOrHeight, curWidthOrHeight] = isX
            ? [curPosition.top, top, height, curPosition.height]
            : [curPosition.left, left, width, curPosition.width];

          // 线的位置
          const linePos = leftOrTop + (widthOrHeight * remainder) / 2;
          // 当前拖拽组件的高度/宽度差
          const delta = (curWidthOrHeight * i) / 2;
          needSorption = judgeNeedSorption(curPos + delta, linePos);
          // 如果找到了就推到数组里，跳出循环
          if (needSorption) {
            curComponents[n].style[key] = linePos - delta;
            line.style[key] = linePos;
            needShow.push(j);
            break;
          }
        }
        if (needSorption) break;
      }
    }
  }

  // 需要显示的数据统一设置显示
  needShow.forEach(val => {
    markline.lines[val].show = true;
  });
};

export { markline, judgeLineShow, hideAllLines };

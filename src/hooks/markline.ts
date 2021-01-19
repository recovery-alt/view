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

// 是否需要吸附
const needSorption = (num1: number, num2: number) => {
  return Math.abs(num1 - num2) < markline.diff;
};

// x-top
// if (needSorption(top, curTop)) {
//   curComponent.position.top = top;
//   markline.lines[0].show = true;
//   markline.lines[0].style.top = top + 'px';
// } else {
//   markline.lines[0].show = false;
// }
// // x-mid
// if (needSorption(top + height / 2, curTop + curHeight / 2)) {
//   curComponent.position.top = top + height / 2 - curHeight / 2;
//   markline.lines[1].show = true;
//   markline.lines[1].style.top = top + height / 2 + 'px';
// } else {
//   markline.lines[1].show = false;
// }
// // x-bottom
// if (needSorption(top + height, curTop + curHeight)) {
//   curComponent.position.top = top + height - curHeight;
//   markline.lines[2].show = true;
//   markline.lines[2].style.top = top + height + 'px';
// } else {
//   markline.lines[2].show = false;
// }

// // y-left
// if (needSorption(left, curLeft)) {
//   curComponent.position.left = left;
//   markline.lines[3].show = true;
//   markline.lines[3].style.left = left + 'px';
// } else {
//   markline.lines[3].show = false;
// }

// // y-mid
// if (needSorption(left + width / 2, curLeft + curWidth / 2)) {
//   curComponent.position.left = left + width / 2 - curWidth / 2;
//   markline.lines[4].show = true;
//   markline.lines[4].style.left = left + width / 2 + 'px';
// } else {
//   markline.lines[4].show = false;
// }

// // y-right
// if (needSorption(left + width, curLeft + curWidth)) {
//   curComponent.position.left = left + width - curWidth;
//   markline.lines[5].show = true;
//   markline.lines[5].style.left = left + width + 'px';
// } else {
//   markline.lines[5].show = false;
// }

const judgeLineShow = (board: Board, curComponent: Component) => {
  const { width: curWidth, height: curHeight, left: curLeft, top: curTop } = curComponent.position;
  const data = [...board.data];
  // 排除自己
  data.splice(board.index, 1);
  data.forEach(component => {
    const { width, height, left, top } = component.position;
    markline.lines.forEach((line, lineIndex) => {
      const setMarkline = (isX: boolean, curPos: number, linePos: number, delta: number) => {
        const leftOrTop = isX ? 'top' : 'left';
        if (needSorption(curPos + delta, linePos)) {
          curComponent.position[leftOrTop] = linePos - delta;
          line.style[leftOrTop] = linePos + 'px';
          line.show = true;
          console.log('show: ', line.show);
          console.log('linePos: ', linePos);
          console.log('leftOrTop: ', leftOrTop);
        } else {
          line.show = false;
        }
      };
      const isX = line.name.includes('x');
      if (isX) {
        for (let i = 0; i < 3; i++) {
          const deltaHeight = lineIndex % 3;
          setMarkline(isX, curTop, top + (height * i) / 2, (curHeight * deltaHeight) / 2);
        }
      } else {
        for (let i = 0; i < 3; i++) {
          const deltaWidth = lineIndex % 3;
          setMarkline(isX, curLeft, left + (width * i) / 2, (curWidth * deltaWidth) / 2);
        }
      }
    });
  });
};

export { markline, judgeLineShow };

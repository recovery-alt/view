import { reactive } from 'vue';
import { getBoardReletedPosition, on, off } from '@/utils';
import { BoardEnum } from '@/store/modules/board';
import { Store } from 'vuex';
import { getInstanceByDom } from 'echarts';
import { hideMenu } from '.';

const boardRefs = reactive<Record<number, HTMLElement>>({});

export const useSelectMask = (store: Store<RootStateType>) => {
  type SelectMask = {
    show: boolean;
    style: CSSStyleDataWithSize;
  };

  const selectMask = reactive<SelectMask>({
    show: false,
    style: {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    },
  });

  const handleMousedown = (e: MouseEvent) => {
    if (e.buttons === 1) {
      selectMask.show = true;
      const { pageX: startX, pageY: startY } = e;
      const mousePosition = getBoardReletedPosition(startX, startY);
      if (!mousePosition) return;
      selectMask.style = {
        ...selectMask.style,
        ...mousePosition,
        width: 0,
        height: 0,
      };

      const mousemove = (e: MouseEvent) => {
        const { pageX, pageY } = e;
        const diffX = pageX - startX;
        const diffY = pageY - startY;
        if (diffX < 0) {
          selectMask.style.left = mousePosition.left + diffX;
        }
        if (diffY < 0) {
          selectMask.style.top = mousePosition.top + diffY;
        }
        selectMask.style.width = Math.abs(diffX);
        selectMask.style.height = Math.abs(diffY);
        store.dispatch(BoardEnum.CALC_SELECTED_BY_RECT, selectMask.style);
      };

      const mouseup = (e: MouseEvent) => {
        e.stopPropagation();
        off('mousemove', mousemove);
        off('mouseup', mouseup);
        selectMask.show = false;
        // 如果重合的话，代表点击事件
        if (e.clientX == startX && e.clientY == startY) {
          store.dispatch(BoardEnum.CANCEL_SELECTED);
          hideMenu();
        }
      };

      on('mousemove', mousemove);
      on('mouseup', mouseup);
    }
  };

  return { selectMask, handleMousedown };
};

export const useBoardRefs = () => {
  const setBoardRef = (el: HTMLElement, index: number) => {
    if (el) {
      boardRefs[index] = el;
    }
  };

  const handleEchartsResize = (index: number) => {
    const dom = boardRefs[index];
    if (dom) {
      const chart = getInstanceByDom(dom);
      chart && chart.resize();
    }
  };

  const handleAllEchartsResize = (board: Board) => {
    for (let i = 0, len = board.data.length; i < len; i++) {
      handleEchartsResize(i);
    }
  };

  return {
    boardRefs,
    setBoardRef,
    handleEchartsResize,
    handleAllEchartsResize,
  };
};

import { reactive } from 'vue';
import { getBoardReletedPosition, on, off } from '@/utils';
import { BoardEnum } from '@/store/modules/board';
import { Store } from 'vuex';

export const useSelectMask = (store: Store<RootStateType>) => {
  const selectMask = reactive<{ show: boolean; style: CSSStyleDataWithSize }>({
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
      selectMask.style = { ...selectMask.style, ...mousePosition, width: 0, height: 0 };

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
      };

      const mouseup = (e: MouseEvent) => {
        e.stopPropagation();
        selectMask.show = false;
        store.dispatch(BoardEnum.CALC_SELECTED_BY_RECT, selectMask.style);
        off('mousemove', mousemove);
        off('mouseup', mouseup);
      };

      on('mousemove', mousemove);
      on('mouseup', mouseup);
    }
  };

  return { selectMask, handleMousedown };
};

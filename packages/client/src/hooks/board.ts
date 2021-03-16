import { onMounted, reactive, ref, Ref, watch, watchEffect } from 'vue';
import { getBoardReletedPosition, on, off } from '@/utils';
import { BoardEnum } from '@/store';
import { Store } from 'vuex';
import { getInstanceByDom } from 'echarts';
import { hideMenu, panel, pageConfig } from '.';

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

export const useThumbnail = (
  screenShotRef: Ref<HTMLElement | null>,
  canvasWrapperRef: Ref<HTMLElement | null>
) => {
  const thumbnailRef = ref<HTMLCanvasElement | null>(null);
  const viewportSize = reactive({ width: 0, height: 0, top: 0, left: 0 });

  // 初始化视窗尺寸
  const resizeViewport = () => {
    if (!screenShotRef.value || !canvasWrapperRef.value || !thumbnailRef.value) return;
    const { width, height } = screenShotRef.value.getBoundingClientRect();
    const { width: viewW, height: viewH } = canvasWrapperRef.value.getBoundingClientRect();
    const { width: parentW, height: parentH } = thumbnailRef.value.getBoundingClientRect();
    const ratioX = viewW / width;
    const ratioY = viewH / height;
    viewportSize.width = ratioX * parentW;
    viewportSize.height = ratioY * parentH;
  };

  // 鼠标按下事件
  const handleThumbnailMousedown = (e: MouseEvent) => {
    if (e.buttons !== 1 || !thumbnailRef.value) return;
    const target = e.target as HTMLElement;
    let startX = e.clientX;
    let startY = e.clientY;
    let { left: startLeft, top: startTop } = viewportSize;
    const { width: parentW, height: parentH } = thumbnailRef.value.getBoundingClientRect();
    const { width, height } = target.getBoundingClientRect();
    const maxLeft = parentW - width;
    const maxTop = parentH - height;

    const mousemove = (e: MouseEvent) => {
      e.stopPropagation();
      if (!canvasWrapperRef.value || !screenShotRef.value) return;
      const { clientX, clientY } = e;
      const diffX = clientX - startX;
      const diffY = clientY - startY;
      let left = 0;
      let top = 0;

      // x轴移动
      if (diffX < 0 && viewportSize.left <= 0) {
        startX = clientX;
        startLeft = 0;
        left = 0;
      } else if (diffX >= 0 && viewportSize.left >= maxLeft) {
        startX = clientX;
        startLeft = maxLeft;
        left = maxLeft;
      } else {
        left = startLeft + diffX;
      }

      // y轴移动
      if (diffY < 0 && viewportSize.top <= 0) {
        startY = clientY;
        startTop = 0;
        top = 0;
      } else if (diffY >= 0 && viewportSize.top >= maxTop) {
        startY = clientY;
        startTop = maxTop;
        top = maxTop;
      } else {
        top = startTop + diffY;
      }

      viewportSize.left = left;
      viewportSize.top = top;
    };

    const mouseup = (e: MouseEvent) => {
      e.stopPropagation();
      off('mousemove', mousemove);
      off('mouseup', mouseup);
    };

    on('mousemove', mousemove);
    on('mouseup', mouseup);
  };

  // 同步滚动
  const syncScroll = () => {
    if (!screenShotRef.value || !canvasWrapperRef.value || !thumbnailRef.value) return;
    const { width, height } = screenShotRef.value.getBoundingClientRect();
    const { width: parentW, height: parentH } = thumbnailRef.value.getBoundingClientRect();
    const { scrollLeft, scrollTop } = canvasWrapperRef.value;
    viewportSize.left = (scrollLeft / width) * parentW;
    viewportSize.top = (scrollTop / height) * parentH;
  };

  // 初始化画布
  const initCanvas = () => {
    if (!screenShotRef.value || !canvasWrapperRef.value || !thumbnailRef.value) return;
    const ctx = thumbnailRef.value.getContext('2d');
    if (!ctx) return;

    const { width: thumbnailW, height: thumbnailH } = thumbnailRef.value.getBoundingClientRect();
    const { width: screenW, height: screenH } = screenShotRef.value.getBoundingClientRect();
    const { width: pageW, height: pageH } = pageConfig;
    const ratioX = thumbnailW / screenW;
    const ratioY = thumbnailH / screenH;

    const reflectW = pageW * ratioX * 2;
    const reflectH = pageH * ratioY * 2;
    const startX = 60 * ratioX * 2;
    const startY = 60 * ratioY * 2;
    ctx.strokeStyle = '#1890ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, reflectW, reflectH);
  };

  onMounted(() => {
    resizeViewport();
    initCanvas();
  });

  watchEffect(() => {
    if (!canvasWrapperRef.value || !thumbnailRef.value || !screenShotRef.value) return;
    const { width, height } = screenShotRef.value.getBoundingClientRect();
    const { width: thumbnailW, height: thumbnailH } = thumbnailRef.value.getBoundingClientRect();
    const left = (viewportSize.left * width) / thumbnailW;
    const top = (viewportSize.top * height) / thumbnailH;
    canvasWrapperRef.value.scroll(left, top);
  });

  watch(panel, () => {
    resizeViewport();
  });

  return { viewportSize, resizeViewport, thumbnailRef, handleThumbnailMousedown, syncScroll };
};

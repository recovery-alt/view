import type { Board, CSSStyleDataWithSize, Data } from '@/typings';
import { Ref } from 'vue';
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import { getBoardReletedPosition, on, off, wrapScale } from '@/utils';
import { useBoardStore, usePageStore, usePanelStore } from '@/store';
import { getInstanceByDom } from 'echarts';
import debounce from 'lodash/debounce';
import { Direction } from '@/enum';

export const useSelectMask = () => {
  const board = useBoardStore();
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
        const diffX = wrapScale(pageX - startX);
        const diffY = wrapScale(pageY - startY);
        if (diffX < 0) {
          selectMask.style.left = mousePosition.left + diffX;
        }
        if (diffY < 0) {
          selectMask.style.top = mousePosition.top + diffY;
        }
        selectMask.style.width = Math.abs(diffX);
        selectMask.style.height = Math.abs(diffY);
        board.calcSelectedByRect(selectMask.style);
      };

      const mouseup = (e: MouseEvent) => {
        e.stopPropagation();
        off('mousemove', mousemove);
        off('mouseup', mouseup);
        selectMask.show = false;
        // 如果重合的话，代表点击事件
        if (e.clientX == startX && e.clientY == startY) {
          board.cancelSelected();
        }
      };

      on('mousemove', mousemove);
      on('mouseup', mouseup);
    }
  };

  return { selectMask, handleMousedown };
};

export const useEchartsResize = () => {
  const handleEchartsResize = (index: number) => {
    const board = useBoardStore();
    const dom = board.refs[index];
    if (dom) {
      const chart = getInstanceByDom(dom);
      chart?.resize();
    }
  };

  const handleAllEchartsResize = (board: Board) => {
    for (let i = 0, len = board.data.length; i < len; i++) {
      handleEchartsResize(i);
    }
  };

  return { handleEchartsResize, handleAllEchartsResize };
};

export const useThumbnail = (
  screenShotRef: Ref<HTMLElement | undefined>,
  canvasWrapperRef: Ref<HTMLElement | undefined>,
  rulerKey: Ref<number>
) => {
  const thumbnailRef = shallowRef<HTMLCanvasElement>();
  const viewportSize = reactive({ width: 0, height: 0, top: 0, left: 0 });
  const showThumbnail = ref(true);
  const page = usePageStore();
  const panel = usePanelStore();

  // 初始化视窗尺寸
  const resizeViewport = () => {
    if (!screenShotRef.value || !canvasWrapperRef.value || !thumbnailRef.value) return;
    const { width, height } = screenShotRef.value.getBoundingClientRect();
    const { width: viewW, height: viewH } = canvasWrapperRef.value.getBoundingClientRect();
    const { width: parentW, height: parentH } = thumbnailRef.value.getBoundingClientRect();
    const ratioX = viewW / width;
    const ratioY = viewH / height;
    viewportSize.width = Math.min(ratioX * parentW, parentW);
    viewportSize.height = Math.min(ratioY * parentH, parentH);
    rulerKey.value++;
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

  // 初始化画布
  const initCanvas = () => {
    if (!screenShotRef.value || !canvasWrapperRef.value || !thumbnailRef.value) return;
    const page = usePageStore();
    const ctx = thumbnailRef.value.getContext('2d');
    if (!ctx) return;
    const { width, height } = thumbnailRef.value;
    ctx.clearRect(0, 0, width, height);

    const { width: thumbnailW, height: thumbnailH } = thumbnailRef.value.getBoundingClientRect();
    const { width: screenW, height: screenH } = screenShotRef.value.getBoundingClientRect();
    const { width: pageW, height: pageH } = page.config;
    const ratioX = thumbnailW / wrapScale(screenW);
    const ratioY = thumbnailH / wrapScale(screenH);

    const canvasRatioX = ratioX * 2;
    const canvasRatioY = ratioY * 2;

    const reflectW = pageW * canvasRatioX;
    const reflectH = pageH * canvasRatioY;
    const startX = 60 * canvasRatioX;
    const startY = 60 * canvasRatioY;
    ctx.strokeStyle = '#1890ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, reflectW, reflectH);
  };

  const debounceResizeViewport = debounce(resizeViewport, 100);
  const debounceInitCanvas = debounce(initCanvas, 100);

  // 同步滚动
  const syncScroll = () => {
    if (!screenShotRef.value || !canvasWrapperRef.value || !thumbnailRef.value) return;
    const { width, height } = screenShotRef.value.getBoundingClientRect();
    const { width: parentW, height: parentH } = thumbnailRef.value.getBoundingClientRect();
    const { scrollLeft, scrollTop } = canvasWrapperRef.value;
    viewportSize.left = (scrollLeft / width) * parentW;
    viewportSize.top = (scrollTop / height) * parentH;
  };

  onMounted(() => {
    window.addEventListener('resize', debounceResizeViewport);
    window.addEventListener('resize', debounceInitCanvas);

    nextTick(() => {
      resizeViewport();
      initCanvas();
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debounceResizeViewport);
    window.removeEventListener('resize', debounceInitCanvas);
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
    setTimeout(() => {
      resizeViewport();
      initCanvas();
    }, 300);
  });

  watchEffect(() => {
    if (page.config.scale) {
      debounceResizeViewport();
      debounceInitCanvas();
    }
  });

  const switchThumbnail = () => {
    showThumbnail.value = !showThumbnail.value;
  };

  return {
    viewportSize,
    resizeViewport,
    thumbnailRef,
    handleThumbnailMousedown,
    syncScroll,
    showThumbnail,
    switchThumbnail,
  };
};

export const useEditSlider = (canvasWrapperRef: Ref<HTMLElement | undefined>) => {
  const page = usePageStore();
  const screenShotSize = reactive({ width: 0, height: 0 });
  const rulerKey = ref(0);

  const sliderFormatter = (value?: number) => value + '%';

  const resizeScreenShot = () => {
    if (!canvasWrapperRef.value) return;
    const { width: minW, height: minH } = canvasWrapperRef.value.getBoundingClientRect();
    const { width: pageW, height: pageH } = page.config;
    const width = wrapScale(pageW + 400, true);
    const height = wrapScale(pageH + 400, true);
    // 减去滚动条宽高
    const minusMinW = minW - 4;
    const minusMinH = minH - 4;
    screenShotSize.width = width <= minusMinW ? minusMinW : width;
    screenShotSize.height = height <= minusMinH ? minusMinH : height;
    rulerKey.value++;
  };

  const handleSliderChange = debounce(resizeScreenShot, 100);

  onMounted(() => {
    watchEffect(() => {
      page.config.scale && resizeScreenShot();
    });
  });

  return { sliderFormatter, handleSliderChange, screenShotSize, rulerKey };
};

export const useRuler = () => {
  type Ruler = { direction: Direction; marklineDct: Direction; marklines: Array<number> };

  const rulerData = reactive<Array<Ruler>>([
    { direction: Direction.X, marklineDct: Direction.Y, marklines: [] },
    { direction: Direction.Y, marklineDct: Direction.X, marklines: [] },
  ]);

  const addMarkline = (e: MouseEvent, direction: Direction) => {
    const { clientX, clientY } = e;
    const target = e.target as HTMLElement;
    const { left, top } = target.getBoundingClientRect();
    const [position, index] = direction === Direction.X ? [clientY - top, 1] : [clientX - left, 0];

    rulerData[index].marklines.push(position);
  };

  const cancelMarkline = (i: number, direction: Direction) => {
    const index = direction === Direction.X ? 0 : 1;
    rulerData[index].marklines.splice(i, 1);
  };

  const getStyle = (direction: Direction, position: { left: number; top: number }) => {
    const rotate = direction === Direction.Y ? ' rotate(90deg)' : '';
    const leftOrTop = direction === Direction.Y ? 'top' : 'left';
    return `transform:${rotate} translateX(${position[leftOrTop]}px)`;
  };

  const getUnit = (direction: Direction) => (direction === Direction.X ? 'width' : 'height');

  return { rulerData, getStyle, getUnit, addMarkline, cancelMarkline };
};

export const useBoardKeydown = () => {
  const page = usePageStore();
  const panel = usePanelStore();
  const board = useBoardStore();

  // 快捷键事件策略
  const strategy: Data<(ctrl: boolean) => void> = {
    Backspace: () => board.del(),
    a: ctrl => ctrl && board.selectAll(),
    s: ctrl => ctrl && page.savePage(),
    c: ctrl => ctrl && board.copy(),
    ArrowLeft: ctrl => {
      if (ctrl) {
        panel.switchPanelShow('layer');
      } else {
        board.selected.forEach(i => {
          board.data[i].style.left -= page.config.gap;
        });
      }
    },
    ArrowUp: ctrl => {
      if (ctrl) {
        panel.switchPanelShow('component');
      } else {
        board.selected.forEach(i => {
          board.data[i].style.top -= page.config.gap;
        });
      }
    },
    ArrowRight: ctrl => {
      if (ctrl) {
        panel.switchPanelShow('config');
      } else {
        board.selected.forEach(i => {
          board.data[i].style.left += page.config.gap;
        });
      }
    },
    ArrowDown: () => {
      board.selected.forEach(i => {
        board.data[i].style.top += page.config.gap;
      });
    },
  };

  const keydown = (e: KeyboardEvent) => {
    if (!document.querySelector('.canvas-wrapper')?.contains(document.activeElement)) return;
    const handleKeydown = strategy[e.key];
    if (handleKeydown) {
      e.preventDefault();
      e.stopPropagation();
      const ctrl = e.ctrlKey || e.metaKey;
      handleKeydown(ctrl);
    }
  };

  onMounted(() => on('keydown', keydown));
  onBeforeUnmount(() => off('keydown', keydown));
};

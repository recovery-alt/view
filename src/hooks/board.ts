import { reactive, ref } from 'vue';
import { v4 } from 'uuid';

type Board = {
  index: number;
  data: Array<Component>;
};

const board = reactive<Board>({
  index: 0,
  data: [],
});

export const useBoard = () => {
  const append = (component: Component) => {
    component.id = v4();
    board.data.push(component);
    board.index = board.data.length - 1;
  };

  const del = (index: number) => {
    board.data.splice(index, 1);
  };

  const cancelSelected = () => {
    board.index = board.data.length;
  };

  return { board, append, del, cancelSelected };
};

export const useDragEvent = (append: (T: Component) => void) => {
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer?.getData('type');
    const offsetX = e.dataTransfer?.getData('offsetX');
    const offsetY = e.dataTransfer?.getData('offsetY');
    if (type && typeof offsetX !== undefined && typeof offsetY !== undefined) {
      const top = e.offsetY;
      const left = e.offsetX;
      append({ component: `v-${type}`, position: { top, left }, style: {} });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return { handleDrop, handleDragOver };
};

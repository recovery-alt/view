import { reactive } from 'vue';
import config from '@/config';

const headSize = reactive({ ...config.defaultBoardSize });

const setHeadSize = (width: number, height: number) => {
  headSize.width = width;
  headSize.height = height;
};

export { headSize, setHeadSize };

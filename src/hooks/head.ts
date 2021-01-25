import { reactive } from 'vue';
import config from '@/config';

const headSize = reactive({ ...config.defaultBoardSize });

export { headSize };

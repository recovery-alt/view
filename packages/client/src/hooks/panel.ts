import type { Data } from '@/typings';
import { reactive } from 'vue';

export const panel = reactive<Data<boolean>>({
  layer: true,
  component: true,
  config: true,
  util: true,
});

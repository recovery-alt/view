import { usePageStore } from '@/store';

export function wrapScale(size: number, isMultiply = false) {
  const page = usePageStore();
  const percent = page.config.scale / 100;
  const result = isMultiply ? size * percent : size / percent;
  return Math.floor(result);
}

import { ref, computed } from 'vue';

export const useResize = () => {
  const width = ref(375);
  const height = ref(667);
  const style = computed(() => ({ width: width.value + 'px', height: height.value + 'px' }));
  return { width, height, style };
};

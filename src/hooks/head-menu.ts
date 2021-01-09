import { ref, computed } from 'vue';

export const useResize = () => {
  const width = ref(1920);
  const height = ref(1080);
  const style = computed(() => ({ width: width.value + 'px', height: height.value + 'px' }));
  return { width, height, style };
};

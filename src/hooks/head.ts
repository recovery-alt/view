import { computed, reactive } from 'vue';

const headSize = reactive({
  width: 375,
  height: 667,
});

const headStyle = computed(() => ({
  width: headSize.width + 'px',
  height: headSize.height + 'px',
}));

export { headSize, headStyle };

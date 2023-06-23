<template>
  <canvas ref="canvas" height="40" class="board-ruler" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, shallowRef, watchEffect } from 'vue';
import { wrapScale } from '@/utils';
import { useThemeStore } from '@/store';
import { theme } from 'ant-design-vue';

const canvas = shallowRef<HTMLCanvasElement>();
const color = ref<string>('');
const themeStore = useThemeStore();
const { token } = theme.useToken();

const reRenderCanvas = () => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  const { width } = canvas.value;
  type NumTuple = [number, number];

  const drawLine = (begin: NumTuple, end: NumTuple, width = 1) => {
    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.lineWidth = width;
    ctx.strokeStyle = color.value;
    ctx.stroke();
  };

  const fillText = (x: number, y: number, text: string | number) => {
    ctx.font = '18px Arial';
    ctx.fillStyle = color.value;
    ctx.fillText(text + '', x, y);
  };

  for (let i = 80; i < width; i += 8) {
    if (i % 80 === 0) {
      fillText(i, 20, wrapScale(i / 2 - 40));
    }

    let height = i % 80 === 0 ? 26 : 32;
    drawLine([i, height], [i, 40]);
  }
};

onMounted(() => {
  nextTick(reRenderCanvas);

  watchEffect(() => {
    if (themeStore.value) {
      color.value = themeStore.value === 'dark' ? '#c9d1d9' : '#000';
      reRenderCanvas();
    }
  });
});
</script>

<style lang="less">
.board-ruler {
  background-color: v-bind('token.colorBgTextHover');
  @apply h-20px;
}
</style>

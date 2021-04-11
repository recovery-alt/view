<template>
  <canvas ref="canvas" height="40" class="board-ruler" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, shallowRef, watchEffect } from 'vue';
import { pageConfig, theme } from '@/hooks';
import { getCurrentCSSVar } from '@/utils';

const canvas = shallowRef<HTMLCanvasElement>();
const color = ref<string>('');

// 每格代表像素值
const pxPerCell = Math.floor(800 / pageConfig.scale);

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

  const fillText = (x: number, y: number, text: string) => {
    ctx.font = '18px Arial';
    ctx.fillStyle = color.value;
    ctx.fillText(text, x, y);
  };

  const canvasUnitPerCell = 2 * pxPerCell;
  const len = width / canvasUnitPerCell - 5;

  for (let i = 0; i < len; i++) {
    const start = i % 20 === 0 ? 0 : i % 10 === 0 ? 30 : 35;
    const x = 80 + i * canvasUnitPerCell;
    drawLine([x, start], [x, 40]);
    if (i % 10 === 0) fillText(x + 5, 30, i * pxPerCell + '');
  }
};

watchEffect(() => {
  if (theme.value) {
    color.value = getCurrentCSSVar('--text-color');
    reRenderCanvas && reRenderCanvas();
  }
});

onMounted(() => {
  nextTick(reRenderCanvas);
});
</script>

<style lang="less">
.board-ruler {
  background-color: var(--hight-contrast-bg);
  height: 20px;
}
</style>

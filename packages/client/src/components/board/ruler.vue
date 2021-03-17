<template>
  <canvas ref="canvas" height="40" class="board-ruler" />
</template>

<script lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { pageConfig } from '@/hooks';

export default {
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);

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
        ctx.stroke();
      };

      const fillText = (x: number, y: number, text: string) => {
        ctx.font = '18px Arial';
        ctx.fillText(text, x, y);
      };

      const canvasUnitPerCell = 2 * pxPerCell;
      const len = width / canvasUnitPerCell - 5;

      for (let i = 0; i < len; i++) {
        const start = i % 20 === 0 ? 0 : i % 10 === 0 ? 30 : 35;
        const x = 80 + i * canvasUnitPerCell;
        drawLine([x, start], [x, 40]);
        if (i % 10 === 0) fillText(x + 5, 30, i * pxPerCell);
      }
    };

    onMounted(() => {
      nextTick(reRenderCanvas);
    });

    return { canvas };
  },
};
</script>

<style lang="less" scoped>
.board-ruler {
  background-color: #fff;
  height: 20px;
}
</style>

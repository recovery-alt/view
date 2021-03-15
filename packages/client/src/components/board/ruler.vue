<template>
  <canvas ref="canvas" style="background-color: #fff" />
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
export default {
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);

    // 每格代表像素值
    const pxPerCell = 8;

    onMounted(() => {
      if (!canvas.value) return;
      const ctx = canvas.value.getContext('2d');
      if (!ctx) return;
      const { width } = canvas.value;

      const drawLine = (begin: [number, number], end: [number, number], width = 1) => {
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

      // drawLine([0, 40], [width, 40]);
      const canvasUnitPerCell = 2 * pxPerCell;
      const len = width / canvasUnitPerCell - 5;

      for (let i = 0; i < len; i++) {
        const start = i % 20 === 0 ? 0 : i % 10 === 0 ? 30 : 35;
        const x = 80 + i * canvasUnitPerCell;
        drawLine([x, start], [x, 40]);
        if (i % 10 === 0) fillText(x + 5, 30, i * pxPerCell);
      }
    });
    return { canvas };
  },
};
</script>

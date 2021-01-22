<template>
  <el-form v-if="board.index > -1" value="left" label-width="80px">
    <el-form-item v-for="item in patchSizeInfoAttr" :key="item.key" :label="item.label">
      <component :is="`el-${item.type}`" v-model="curComponent.style[item.key]" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, watchEffect, computed } from 'vue';
import { useStore } from '@/store';
import { FormEnum } from '@/enum';
import { presetSizeInfo } from '@/options';

const name = 'attr-panel';

const setup = () => {
  const store = useStore();
  const { board } = store.state;
  // 当前选中组件
  const curComponent = computed(() => board.data[board.index]);
  // 添加位置大小信息
  const patchSizeInfoAttr = computed(() => [...presetSizeInfo, ...curComponent.value.attr]);

  watchEffect(() => {
    // 初始化form & 写入form值
    if (board.index > -1) {
      const { style } = board.data[board.index];
      patchSizeInfoAttr.value.forEach(val => {
        const { key, type } = val;
        const empty = type === FormEnum.INPUT_NUMBER ? 0 : '';
        // 不存在的话就赋空值
        style[key] = style[key] || (empty as any);
      });
    }
  });

  return { board, curComponent, patchSizeInfoAttr };
};

export default defineComponent({ name, setup });
</script>

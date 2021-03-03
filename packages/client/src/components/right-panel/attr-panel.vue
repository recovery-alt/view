<template>
  <a-collapse v-model="activeName">
    <a-collapse-panel
      v-for="val in presetComponentAttr"
      :key="val.title"
      :title="val.title"
      :header="val.title"
    >
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item v-for="item in val.data" :key="item.key" :label="item.label">
          <input
            v-if="item.type === FormEnum.COLOR_PICKER"
            v-model="curComponent.style[item.key]"
            type="color"
          />
          <component :is="`a-${item.type}`" v-else v-model:value="curComponent.style[item.key]">
            <template v-if="item.type === 'select'">
              <a-select-option v-for="option in item.data" :key="option.id" :value="option.id">
                {{ option.label }}
              </a-select-option>
            </template>
          </component>
        </a-form-item>
      </a-form>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import { watchEffect, computed, ref } from 'vue';
import { useStore } from '@/store';
import { FormEnum } from '@/enum';
import { presetComponentAttr } from '@/config';

export default {
  name: 'attr-panel',
  setup() {
    const store = useStore();
    const { board } = store.state;

    const activeName = ref(presetComponentAttr[0].title);

    // 当前选中组件
    const curComponent = computed(() => {
      return board.selected.length === 1 ? board.data[board.selected[0]] : null;
    });

    watchEffect(() => {
      // 初始化form & 写入form值
      if (board.selected.length === 1) {
        const { style } = board.data[board.selected[0]];
        presetComponentAttr.forEach(val => {
          const { data } = val;
          data.forEach(item => {
            const { type, key } = item;
            const empty = type === FormEnum.INPUT_NUMBER ? 0 : '';
            // 不存在的话就赋空值
            style[key] = style[key] || empty;
          });
        });
      }
    });

    return { board, curComponent, presetComponentAttr, activeName, FormEnum };
  },
};
</script>

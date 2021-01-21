<template>
  <el-form>
    <el-form-item v-for="item in items" :key="item.key" :label="item.label">
      <component :is="`el-${item.type}`" v-model="form[item.key]"></component>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref, reactive, watch, onMounted, computed } from 'vue';
import { useStore } from '@/store';

const name = 'attr-panel';

const setup = () => {
  const store = useStore();
  const { board } = store.state;

  const items = ref<Array<ComponentAttr>>([]);

  const form = reactive<{ [P in keyof CSSStyleDeclaration]?: string }>({});

  watchEffect(() => {
    if (board.index > -1) {
      const { attr } = board.data[board.index];
      items.value = attr;
    }
  });

  watchEffect(() => {
    if (board.index > -1) {
      const { style } = board.data[board.index];

      items.value.forEach(val => {
        if (val.type === FormEnum.INPUT_NUMBER) {
          // @ts-ignore
          style[val.key] = form[val.key] + 'px';
        } else {
          // @ts-ignore
          style[val.key] = form[val.key];
        }
      });
    }
  });

  return { items, form };
};

export default defineComponent({ name, setup });
</script>

<style></style>

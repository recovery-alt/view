<template>
  <el-form v-if="componentId">
    <el-form-item v-for="item in items" :key="item.key" :label="item.label">
      <component :is="`el-${item.type}`" v-model="form[componentId][item.key]" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref, reactive, watch, onMounted, computed } from 'vue';
import { useStore } from '@/store';
import { FormEnum } from '@/enum';

const name = 'attr-panel';

const setup = () => {
  const store = useStore();
  const { board } = store.state;

  const items = ref<Array<ComponentAttr>>([]);

  const form = reactive<Data<CSSStyleData<string | number>>>({});

  const componentId = computed(() => {
    const curComponent = board.data[board.index];
    return curComponent && curComponent.id;
  });

  watchEffect(() => {
    // 初始化form & 写入form值
    if (board.index > -1) {
      const { attr, id } = board.data[board.index];
      items.value = attr;
      const style: CSSStyleData<string | number> = {};
      attr.forEach(val => {
        const { key, type } = val;
        const empty = type === FormEnum.INPUT_NUMBER ? 0 : '';
        style[key] = form[id] ? form[id][key] : empty;
      });
      form[id] = style;
    }
  });

  watchEffect(() => {
    if (board.index > -1) {
      const { style, id } = board.data[board.index];
      Object.assign(style, form[id]);
    }
  });

  return { items, form, componentId };
};

export default defineComponent({ name, setup });
</script>

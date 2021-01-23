<template>
  <el-form v-if="curComponent" value="left" label-width="80px" size="mini">
    <el-form-item v-for="item in patchSizeInfoAttr" :key="item.key" :label="item.label">
      <component :is="item.parent" v-model="curComponent.style[item.key]">
        <template v-if="item.child === 'el-option'">
          <component
            :is="item.child"
            v-for="option in item.data"
            :key="option.id"
            :label="option.label"
            :value="option.id"
          ></component>
        </template>
      </component>
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
  const curComponent = computed(() => {
    return board.selected.length === 1 ? board.data[board.selected[0]] : null;
  });
  // 添加位置大小信息
  const patchSizeInfoAttr = computed(() => {
    return curComponent.value && [...presetSizeInfo, ...curComponent.value.attr];
  });

  const getType = (parentType: FormEnum) => {
    let parent, child;
    switch (parentType) {
      case FormEnum.RADIO:
        parent = 'el-radio-group';
        child = `el-${parentType}`;
        break;
      case FormEnum.CHECKBOX:
        parent = 'el-checkbox-group';
        child = `el-${parentType}`;
        break;
      case FormEnum.SELECT:
        parent = `el-${parentType}`;
        child = `el-option`;
        break;
      default:
        parent = `el-${parentType}`;
        child = '';
    }
    return { parent, child };
  };

  watchEffect(() => {
    // 初始化form & 写入form值
    if (board.selected.length === 1) {
      const { style } = board.data[board.selected[0]];
      if (!patchSizeInfoAttr.value) return;
      patchSizeInfoAttr.value.map(val => {
        const { key, type } = val;
        const empty = type === FormEnum.INPUT_NUMBER ? 0 : '';
        // 不存在的话就赋空值
        style[key] = style[key] || (empty as any);
        Object.assign(val, getType(type));
      });
    }
  });

  return { board, curComponent, patchSizeInfoAttr };
};

export default defineComponent({ name, setup });
</script>

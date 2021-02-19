<template>
  <el-collapse v-model="activeName">
    <el-collapse-item
      v-for="val in presetComponentAttr"
      :key="val.title"
      :title="val.title"
      :name="val.title"
    >
      <el-form value="left" label-width="80px" size="mini">
        <el-form-item v-for="item in val.data" :key="item.key" :label="item.label">
          <component :is="item.parent" v-model="curComponent.style[item.key]">
            <template v-if="item.child === 'el-option'">
              <component
                :is="item.child"
                v-for="option in item.data"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              />
            </template>
          </component>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts">
import { watchEffect, computed, ref } from 'vue';
import { useStore } from '@/store';
import { FormEnum } from '@/enum';
import { presetComponentAttr } from '@/config';

const name = 'attr-panel';

const setup = () => {
  const store = useStore();
  const { board } = store.state;

  const activeName = ref(presetComponentAttr[0].title);

  // 当前选中组件
  const curComponent = computed(() => {
    return board.selected.length === 1 ? board.data[board.selected[0]] : null;
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
      presetComponentAttr.forEach(val => {
        const { data } = val;
        data.forEach(item => {
          const { type, key } = item;
          const empty = type === FormEnum.INPUT_NUMBER ? 0 : '';
          // 不存在的话就赋空值
          style[key] = style[key] || (empty as any);
          Object.assign(item, getType(type));
        });
      });
    }
  });

  return { board, curComponent, presetComponentAttr, activeName };
};

export default { name, setup };
</script>

<template>
  <a-form label-align="left" :label-col="{ span: 6, offset: 2 }" :wrapper-col="{ span: 16 }">
    <a-form-item label="图表尺寸">
      <a-row>
        <a-col span="8">
          <a-input-number v-model:value="curComponent.style.width" size="small" />
        </a-col>
        <a-col span="8" offset="4">
          <a-input-number v-model:value="curComponent.style.height" size="small" />
        </a-col>
      </a-row>
      <template #extra>
        <div class="attr-panel__extra">
          <span>宽度</span>
          <span>高度</span>
        </div>
      </template>
    </a-form-item>
    <a-form-item label="图表位置">
      <a-row>
        <a-col span="8">
          <a-input-number v-model:value="curComponent.style.left" size="small" />
        </a-col>
        <a-col span="8" offset="4">
          <a-input-number v-model:value="curComponent.style.top" size="small" />
        </a-col>
      </a-row>
      <template #extra>
        <div class="attr-panel__extra">
          <span>x轴</span>
          <span>y轴</span>
        </div>
      </template>
    </a-form-item>
    <a-form-item label="透明度">
      <a-row>
        <a-col span="8">
          <a-slider
            v-model:value="curComponent.style.opacity"
            size="small"
            :min="0"
            :max="1"
            :step="0.1"
          />
        </a-col>
        <a-col span="8" offset="4">
          <a-input-number
            v-model:value="curComponent.style.opacity"
            size="small"
            :min="0"
            :max="1"
            :step="0.1"
          />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="旋转角度">
      <a-input-number v-model:value="curComponent.style.rotate" :precision="0" size="small" />
    </a-form-item>
  </a-form>
  <a-collapse v-model:activeKey="activeName" size="small">
    <a-collapse-panel
      v-for="val in presetComponentAttr"
      :key="val.title"
      :title="val.title"
      :header="val.title"
    >
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item v-for="item in val.data" :key="item.key" :label="item.label">
          <color-picker
            v-if="item.type === FormEnum.COLOR_PICKER"
            v-model="curComponent.style[item.key]"
          />
          <component
            :is="`a-${item.type}`"
            v-bind="item.props"
            v-else
            v-model:value="curComponent.style[item.key]"
          >
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

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useStore } from '@/store';
import { FormEnum } from '@/enum';
import { presetComponentAttr } from '@/config';
import { ColorPicker } from '@/components';

const store = useStore();
const { board } = store.state;

const activeName = ref(presetComponentAttr[0].title);

const curComponent = computed(() => board.data[board.selected[0]]);

watchEffect(() => {
  if (board.selected.length === 1) {
    const { style } = board.data[board.selected[0]];
    presetComponentAttr.forEach(val => {
      const { data } = val;
      data.forEach(item => {
        const { key, default: defaultVal } = item;
        if (!style[key]) {
          style[key] = defaultVal;
        }
      });
    });
  }
});
</script>

<style lang="less">
.attr-panel {
  &__extra {
    width: 100%;
    display: flex;

    span {
      flex: 1;
    }
  }
}
</style>

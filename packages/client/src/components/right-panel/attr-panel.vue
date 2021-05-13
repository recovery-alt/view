<template>
  <a-form label-align="right" :label-col="{ span: 6, offset: 2 }" :wrapper-col="{ span: 16 }">
    <a-form-item label="名称">
      <a-col span="22">
        <a-input v-model:value="curComponent.label" size="small" />
      </a-col>
    </a-form-item>
    <a-form-item label="尺寸">
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
    <a-form-item label="位置">
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
      <a-row>
        <a-col span="8">
          <a-input-number v-model:value="curComponent.style.rotate" :precision="0" size="small" />
        </a-col>
        <a-col span="4" offset="4">
          <a-button size="small" @click="rotate(true)">
            <template #icon>
              <RotateLeftOutlined />
            </template>
          </a-button>
        </a-col>
        <a-col span="4">
          <a-button size="small" @click="rotate()">
            <template #icon>
              <RotateRightOutlined />
            </template>
          </a-button>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
  <a-collapse v-model:activeKey="activeName" expand-icon-position="right" size="small">
    <a-collapse-panel
      v-for="val in presetComponentAttr"
      :key="val.title"
      :title="val.title"
      :header="val.title"
    >
      <a-form label-align="right" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item v-for="item in val.data" :key="item.key" :label="item.label">
          <color-picker
            v-if="item.type === FormEnum.COLOR_PICKER"
            v-model="curComponent.style[item.key]"
          />
          <component
            :is="`a-${item.type}`"
            v-else
            v-model:value="curComponent.style[item.key]"
            v-bind="item.props"
            size="small"
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
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons-vue';

const store = useStore();
const { board } = store.state;

const activeName = ref('');

const curComponent = computed(() => board.data[board.selected[0]]);

const rotate = (reverse = false) => {
  const deg = reverse ? -45 : 45;
  curComponent.value.style.rotate += deg;
};

watchEffect(() => {
  if (board.selected.length === 1) {
    const { style } = board.data[board.selected[0]];
    presetComponentAttr.forEach(val => {
      const { data } = val;
      data.forEach(item => {
        const { key, default: defaultVal } = item;
        if (!style[key]) style[key] = defaultVal;
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

<template>
  <a-input
    v-model:value="inputValue"
    size="small"
    :placeholder="placeholder"
    allow-clear
    @click="clickInputColor"
  >
    <template #suffix>
      <input ref="inputColor" v-model="inputValue" type="color" />
    </template>
  </a-input>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, shallowRef } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: () => '',
  },
  placeholder: {
    type: String,
    default: () => '请选择颜色',
  },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');

const inputColor = shallowRef<HTMLElement>();

const clickInputColor = () => {
  if (!inputColor.value) return;
  inputColor.value.click();
};

watch(inputValue, value => {
  emit('update:modelValue', value);
});

watchEffect(() => {
  inputValue.value = props.modelValue + '';
});
</script>

<style lang="less">
input[type='color'] {
  position: absolute;
  width: 0;
  height: 0;
  left: 0;
  bottom: 0;
  visibility: hidden;
}
</style>

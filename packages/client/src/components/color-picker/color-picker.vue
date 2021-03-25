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

<script lang="ts">
import { ref, watch, watchEffect, defineComponent } from 'vue';

export default defineComponent({
  name: 'color-picker',
  props: {
    modelValue: {
      type: [String, Number],
      default: () => '',
    },
    placeholder: {
      type: String,
      default: () => '请选择颜色',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = ref('');

    const inputColor = ref<null | HTMLElement>(null);

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

    return { inputValue, inputColor, clickInputColor };
  },
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

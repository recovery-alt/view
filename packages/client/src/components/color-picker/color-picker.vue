<template>
  <a-input v-model:value="inputValue" allow-clear @click="clickInputColor">
    <template #prefix>
      <input ref="inputColor" v-model="inputValue" type="color" />
    </template>
  </a-input>
</template>

<script lang="ts">
import { onMounted, ref, watch } from 'vue';

export default {
  name: 'color-picker',
  props: {
    modelValue: {
      type: String,
      default: () => '',
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

    onMounted(() => {
      inputValue.value = props.modelValue;
    });

    return { inputValue, inputColor, clickInputColor };
  },
};
</script>

<style lang="less" scoped>
.reset {
  cursor: pointer;
}

:deep {
  input[type='color'] {
    width: 0;
    height: 0;
    padding: 0;
    visibility: hidden;
    vertical-align: bottom;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>

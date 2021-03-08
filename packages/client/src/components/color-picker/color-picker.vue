<template>
  <a-input type="color" :value="input" @change="handleChange">
    <template #addonAfter>
      <span class="reset" @click="reset">重置</span>
    </template>
  </a-input>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
export default {
  name: 'color-picker',
  props: {
    modelValue: {
      type: String,
      default: () => 'transparent',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const input = ref('transparent');

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      input.value = target.value;
      emit('update:modelValue', target.value);
    };

    const reset = () => {
      input.value = 'transparent';
      emit('update:modelValue', input.value);
    };

    onMounted(() => {
      input.value = props.modelValue;
    });

    return { reset, input, handleChange };
  },
};
</script>

<style lang="less" scoped>
.reset {
  cursor: pointer;
}
</style>

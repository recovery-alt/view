<template>
  <Input
    v-model:value="inputValue"
    size="small"
    :placeholder="placeholder || t('placeholder.select')"
    allow-clear
    @click="clickInputColor"
  >
    <template #suffix>
      <input ref="inputColor" v-model="inputValue" type="color" />
    </template>
  </Input>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, shallowRef } from 'vue';
import { Input } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { global as messages } from '@/locales';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: () => '',
  },
  placeholder: String,
});

const emit = defineEmits(['update:modelValue']);
const { t } = useI18n({ useScope: 'local', messages });

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

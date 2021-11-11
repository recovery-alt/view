<template>
  <ColorPicker v-if="field.type === FormEnum.COLOR_PICKER" v-model="model[field.model]" />
  <template v-else-if="field.type === FormEnum.BTN_GROUP">
    <Tooltip v-for="item in field.data" :key="item.icon" :title="item.tip" placement="bottom">
      <Button
        class="form-generator__btn"
        size="small"
        :type="model[field.model] === item.value ? 'primary' : 'default'"
        @click="model[field.model] = item.value"
      >
        <component :is="item.icon" />
      </Button>
    </Tooltip>
  </template>
  <Switch
    v-else-if="field.type === FormEnum.SWITCH"
    v-model:checked="model[field.model]"
    v-bind="field.propsData"
    size="small"
  />
  <component
    :is="map[field.type]"
    v-else
    v-model:value="model[field.model]"
    v-bind="field.propsData"
    allow-clear
    :placeholder="field.type === FormEnum.SELECT ? t('select') : t('input')"
    size="small"
  >
    <template v-if="field.type === FormEnum.SELECT">
      <SelectOption v-for="option in field.data" :key="option.id" :value="option.id">
        {{ option.label }}
      </SelectOption>
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { FieldItem, Data } from '@/typings';
import type { PropType } from 'vue';
import { ColorPicker } from '../color-picker';
import { FormEnum } from '@/enum';
import {
  Tooltip,
  Button,
  Switch,
  Select,
  SelectOption,
  Input,
  InputNumber,
  Checkbox,
  Slider,
  Radio,
  Textarea,
} from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { formGenerator as messages } from '@/locales';

const map: Data = {
  radio: Radio,
  checkbox: Checkbox,
  input: Input,
  select: Select,
  switch: Switch,
  slider: Slider,
  'input-number': InputNumber,
  'color-picker': ColorPicker,
  textarea: Textarea,
};

defineProps({
  field: {
    type: Object as PropType<FieldItem>,
    default: () => ({}),
  },
  model: {
    type: Object,
    default: () => ({}),
  },
});

const { t } = useI18n({ useScope: 'local', messages });
</script>

<style lang="less">
.form-generator {
  &__btn {
    margin-left: 10px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>

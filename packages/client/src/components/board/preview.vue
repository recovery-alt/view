<template>
  <teleport to="#modal">
    <div v-if="modelValue" class="preview__mask">
      <div class="preview__box">
        <div class="preview__title">
          {{ page.config.title }}
          <CloseSquareOutlined class="preview__close" @click="handleClose" />
        </div>
        <div class="flex-1 overflow-auto">
          <div class="relative" :style="patchUnit(pageStyle)">
            <div
              v-for="(item, index) in board.data"
              :key="item.id"
              class="absolute box-border"
              :z-index="index"
              :style="splitStyleAndPatch(item.style)"
            >
              <BoardBox :data="item" class="h-full first:absolute w-1f h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useBoardStore, usePageStore } from '@/store';
import { CloseSquareOutlined } from '@ant-design/icons-vue';
import { splitStyleAndPatch, patchUnit } from '@/utils';
import BoardBox from './box.vue';
import { theme } from 'ant-design-vue';

defineProps({ modelValue: Boolean });

const emit = defineEmits(['update:modelValue']);

const board = useBoardStore();
const page = usePageStore();
const { token } = theme.useToken();

const pageStyle = computed(() => {
  const { width, height, backgroundColor } = page.config;
  return { width, height, backgroundColor };
});

const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="less">
.preview {
  &__mask {
    @apply absolute top-0 left-0 bottom-0 right-0 bg-dark-300 z-1000;
  }

  &__box {
    background-color: v-bind('token.colorBgBase');
    transform: translate(-50%, -50%);
    color: v-bind('token.colorSuccess');
    @apply absolute top-1/2 left-1/2 max-w-80vw max-h-80vh overflow-hidden flex flex-col;
  }

  &__title {
    background-color: v-bind('token.colorBgElevated');
    color: v-bind('token.colorText');
    border-bottom: 1px solid v-bind('token.colorBorder');
    @apply relative h-50px leading-50px text-center flex-shrink-0;
  }

  &__close {
    @apply absolute right-20px top-20px text-20px cursor-pointer;

    &:hover {
      color: v-bind('token.colorPrimary');
    }
  }
}
</style>

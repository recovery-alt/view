<template>
  <teleport to="#modal">
    <div v-if="modelValue" class="preview__mask">
      <div class="preview__box">
        <div class="preview__title">
          {{ page.config.title }}
          <CloseSquareOutlined class="preview__close" @click="handleClose" />
        </div>
        <div class="preview__container">
          <div :style="patchUnit(pageStyle)">
            <div
              v-for="(item, index) in board.data"
              :key="item.id"
              class="board-wrapper"
              :z-index="index"
              :style="splitStyleAndPatch(item.style)"
            >
              <BoardBox :data="item" class="board-component" />
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

defineProps({ modelValue: Boolean });

const emit = defineEmits(['update:modelValue']);

const board = useBoardStore();
const page = usePageStore();

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
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgb(0 0 0 / 70%);
    z-index: 1000;
  }

  &__box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 80vw;
    max-height: 80vh;
    overflow: hidden;
    color: @black;
    display: flex;
    flex-direction: column;
  }

  &__title {
    position: relative;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: @modal-header-bg;
    color: @text-color;
    border-bottom: 1px solid @border-color-base;
  }

  &__close {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 20px;
    cursor: pointer;

    &:hover {
      color: @primary-color;
    }
  }

  &__container {
    flex: 1;
    overflow: auto;

    & > div {
      position: relative;
    }
  }
}

.board-wrapper {
  position: absolute;
  box-sizing: border-box;

  & > *:first-child {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .board-component {
    height: 100%;
  }
}
</style>

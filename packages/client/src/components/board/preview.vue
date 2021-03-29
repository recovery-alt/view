<template>
  <teleport to="#modal">
    <div v-if="modelValue" class="modal-mask">
      <div class="modal-box" :style="style">
        <CloseSquareOutlined class="modal-close" @click="handleClose" />
        <div
          v-for="(item, index) in board.data"
          :key="item.id"
          class="board-wrapper"
          :z-index="index"
          :style="splitStyleAndPatch(item.style)"
        >
          <component
            :is="item.component"
            class="board-component"
            :group="item.group"
            :style="splitStyleAndPatch(item.style, false)"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { pageConfig } from '@/hooks';
import { useStore } from '@/store';
import { CloseSquareOutlined } from '@ant-design/icons-vue';
import { splitStyleAndPatch } from '@/utils';

export default defineComponent({
  name: 'board-preview',
  components: { CloseSquareOutlined },
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore();

    const { board } = store.state;

    const style = computed(() => ({
      width: pageConfig.width + 'px',
      height: pageConfig.height + 'px',
    }));

    const handleClose = () => {
      emit('update:modelValue', false);
    };

    return { handleClose, style, board, splitStyleAndPatch };
  },
});
</script>

<style lang="less">
.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.modal-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  max-width: 80vw;
  max-height: 80vh;
  overflow: auto;
}

.modal-close {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: var(--primary-color);
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

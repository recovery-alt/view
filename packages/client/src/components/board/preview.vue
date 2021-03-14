<template>
  <teleport to="#modal">
    <div v-if="modelValue" class="modal-mask">
      <div class="modal-box" :style="style">
        <CloseSquareOutlined class="modal-close" @click="handleClose" />
        <board-wrapper :data="board.data" />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed } from 'vue';
import { usePageConfig } from '@/hooks';
import BoardWrapper from './wrapper.vue';
import { useStore } from '@/store';
import { CloseSquareOutlined } from '@ant-design/icons-vue';

export default {
  components: { BoardWrapper, CloseSquareOutlined },
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore();

    const { board } = store.state;

    const { pageConfig } = usePageConfig();

    const style = computed(() => ({
      width: pageConfig.width + 'px',
      height: pageConfig.height + 'px',
    }));

    const handleClose = () => {
      emit('update:modelValue', false);
    };

    return { handleClose, style, board };
  },
};
</script>

<style lang="less" scoped>
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
    color: @primary-8;
  }
}
</style>

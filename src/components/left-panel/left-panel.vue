<template>
  <section class="main-left" @dragstart="handleDragStart">
    <button
      draggable="true"
      v-for="item in gallery"
      :key="item.type"
      type="primary"
      :data-type="item.type"
    >
      {{ item.name }}
    </button>
    <ul class="component-list">
      <li
        v-for="(item, index) in board.data"
        class="component-list_item"
        :class="{ active: board.selected.includes(index) }"
        :key="item.id"
        @click="e => changeSelected(e, index)"
      >
        <i class="el-icon-folder"></i>
        <span>
          {{ item.label }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent } from 'vue';
import { getGalleryList } from '@/gallery';
import { BoardEnum } from '@/store/modules/board';

const setup = () => {
  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLDataListElement;
    if (target.dataset.type) {
      e.dataTransfer?.setData('type', target.dataset.type);
    }
  };

  const store = useStore();

  const board = store.state.board;

  const gallery = getGalleryList();

  const changeSelected = (e: MouseEvent, index: number) => {
    if (e.ctrlKey || e.metaKey) {
      store.dispatch(BoardEnum.CHANGE_SELECTED, index);
    } else {
      store.dispatch(BoardEnum.SET_INDEX, index);
    }
  };

  return { gallery, handleDragStart, board, changeSelected };
};

export default defineComponent({ setup });
</script>

<style lang="scss" scoped>
.main-left {
  width: 200px;
  box-sizing: border-box;
  padding: 15px;
  border-right: 1px solid $el-border-1;
}

.component-list {
  &_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 2px;
    margin-top: 10px;
    height: 50px;
    box-sizing: border-box;
    padding: 0 10px;
    cursor: pointer;

    @mixin active {
      background-color: $el-primary-8;
    }

    &.active {
      @include active;
    }

    &:hover {
      @include active;
    }

    i {
      font-size: 20px;
    }
  }
}
</style>

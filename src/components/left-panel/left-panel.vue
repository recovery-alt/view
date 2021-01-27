<template>
  <section class="main-left" @dragstart="handleDragStart">
    <el-tabs tab-position="left">
      <el-tab-pane>
        <template #label>
          <div class="tab-label">
            <i class="el-icon-house"></i>
            列表
          </div>
        </template>
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
      </el-tab-pane>
      <el-tab-pane v-for="tab in galleryGroup" :key="tab.groupName">
        <template #label>
          <div class="tab-label">
            <i class="el-icon-house"></i>
            {{ tab.groupName }}
          </div>
        </template>
        <button
          draggable="true"
          v-for="item in tab.list"
          :key="item.type"
          type="primary"
          :data-type="item.type"
        >
          {{ item.name }}
        </button>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent } from 'vue';
import { getGalleryGroup } from '@/gallery';
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

  const galleryGroup = getGalleryGroup();

  const changeSelected = (e: MouseEvent, index: number) => {
    if (e.ctrlKey || e.metaKey) {
      store.dispatch(BoardEnum.CHANGE_SELECTED, index);
    } else {
      store.dispatch(BoardEnum.SET_INDEX, index);
    }
  };

  return { handleDragStart, board, changeSelected, galleryGroup };
};

export default defineComponent({ setup });
</script>

<style lang="scss" scoped>
.main-left {
  flex-basis: 200px;
  flex-shrink: 0;
  box-sizing: border-box;
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

::v-deep {
  .el-tabs--left {
    height: 100%;
  }
  .el-tabs__item {
    padding: 0 10px;
  }
}
</style>

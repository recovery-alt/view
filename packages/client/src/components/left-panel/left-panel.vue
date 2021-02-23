<template>
  <section class="main-left" @dragstart="handleDragStart">
    <el-tabs tab-position="left">
      <el-tab-pane v-for="tab in galleryGroup" :key="tab.groupName">
        <template #label>
          <div class="tab-label">
            <i :class="`el-icon-${tab.icon}`" />
            <span>{{ tab.groupName }}</span>
          </div>
        </template>
        <ul class="tab-list">
          <li
            v-for="item in tab.list"
            :key="item.type"
            draggable="true"
            class="tab-list_item"
            :data-type="item.type"
          >
            <div>{{ item.name }}</div>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <div class="tab-label">
            <i class="el-icon-s-order" />
            <span>列表</span>
          </div>
        </template>
        <ul v-if="board.data.length > 0" class="component-list">
          <li
            v-for="(item, index) in board.data"
            :key="item.id"
            class="component-list_item"
            :class="{ active: board.selected.includes(index) }"
            @click="e => changeSelected(e, index)"
          >
            <i class="el-icon-folder" />
            <span>
              {{ item.label }}
            </span>
          </li>
        </ul>
        <el-empty v-else description="尚未添加任何组件" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { getGalleryGroup } from '@/gallery';
import { BoardEnum } from '@/store/modules/board';

export default {
  name: 'left-panel',
  setup() {
    const store = useStore();

    const board = store.state.board;

    const galleryGroup = getGalleryGroup();

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLDataListElement;
      if (target.dataset.type) {
        e.dataTransfer?.setData('type', target.dataset.type);
      }
    };

    const changeSelected = (e: MouseEvent, index: number) => {
      if (e.ctrlKey || e.metaKey) {
        store.dispatch(BoardEnum.CHANGE_SELECTED, index);
      } else {
        store.dispatch(BoardEnum.SET_INDEX, index);
      }
    };

    return { handleDragStart, board, changeSelected, galleryGroup };
  },
};
</script>

<style lang="scss" scoped>
.main-left {
  flex-basis: 300px;
  flex-shrink: 0;
  box-sizing: border-box;
  border-right: 1px solid $el-border-1;
}

.component-list {
  margin-right: 10px;
  &_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 2px;
    margin-top: 10px;
    height: 50px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 0 10px;
    border-radius: 3px;

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

:deep {
  .el-tabs--left {
    height: 100%;
  }
  .el-tabs__item {
    height: auto;
    padding: 0;
  }
}

.tab-label {
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  i {
    margin-top: 15px;
    font-size: 18px;
  }

  span {
    display: block;
    height: 30px;
  }
}

.tab-list {
  display: flex;
  padding: 10px;
  &_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    width: 70px;
    height: 70px;

    &::before {
      display: block;
      content: '';
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background-color: $el-primary-7;
    }

    div {
      text-align: center;
    }
  }
}
</style>

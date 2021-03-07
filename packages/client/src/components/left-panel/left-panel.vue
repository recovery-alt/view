<template>
  <section class="main-left" @dragstart="handleDragStart">
    <a-tabs v-model:activeKey="activeTab" tab-position="left">
      <a-tab-pane v-for="tab in galleryGroup" :key="tab.groupName">
        <template #tab>
          <div class="tab-label">
            <component :is="tab.icon" />
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
      </a-tab-pane>
      <a-tab-pane>
        <template #tab>
          <div class="tab-label">
            <database-outlined />
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
            <folder-outlined />
            <span>
              {{ item.label }}
            </span>
          </li>
        </ul>
        <a-empty v-else description="尚未添加任何组件" />
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { getGalleryGroup } from '@/gallery';
import { BoardEnum } from '@/store/modules/board';
import { ref } from 'vue';
import {
  DatabaseOutlined,
  FolderOutlined,
  LineChartOutlined,
  BankOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'left-panel',
  components: { DatabaseOutlined, FolderOutlined, LineChartOutlined, BankOutlined },
  setup() {
    const store = useStore();

    const board = store.state.board;

    const activeTab = ref('基础');

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

    return { handleDragStart, board, changeSelected, galleryGroup, activeTab };
  },
};
</script>

<style lang="less" scoped>
.main-left {
  flex-basis: 300px;
  flex-shrink: 0;
  box-sizing: border-box;
  border-right: 1px solid @border-color-base;
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

    .active {
      background-color: @primary-1;
    }

    &.active {
      .active;
    }

    &:hover {
      .active;
    }

    i {
      font-size: 20px;
    }
  }
}

.tab-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    margin-top: 6px;
    font-size: 16px;
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
      background-color: @primary-2;
    }

    div {
      text-align: center;
    }
  }
}

:deep {
  .ant-tabs .ant-tabs-left-content {
    padding-left: 10px;
  }

  .ant-tabs .ant-tabs-left-bar .ant-tabs-tab,
  .ant-tabs .ant-tabs-right-bar .ant-tabs-tab {
    padding: 4px 10px;
  }
  .ant-tabs-nav .ant-tabs-tab .anticon {
    margin-right: 0;
  }
  .ant-tabs-vertical.ant-tabs-line.ant-tabs.ant-tabs-left {
    height: 100%;
  }
}
</style>

<template>
  <div class="data-panel">
    <div class="timeline-wrapper">
      <a-timeline>
        <a-timeline-item
          v-for="item in timeline"
          :key="item.text"
          :color="item.actived ? 'blue' : 'gray'"
        >
          <div class="timeline-wrapper__item">
            <span>{{ item.text }}</span>
            <button>添加过滤</button>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
    <a-table :data-source="table.data" :columns="table.columns" />
    <a-drawer v-model:visible="drawer.show" placement="right" :width="400"></a-drawer>
    <a-button type="primary">配置数据源</a-button>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { computed, reactive } from 'vue';

export default {
  setup() {
    const store = useStore();
    const { board } = store.state;

    const drawer = reactive({
      show: false,
    });

    const table = reactive({
      data: [],
      columns: [],
    });

    const timeline = reactive([
      { actived: false, text: '静态数据' },
      { actived: false, text: '数据过滤器' },
      { actived: false, text: '数据响应结果（只读）' },
    ]);

    const curComponent = computed(() => {
      return board.data[board.selected[0]];
    });

    return { curComponent, drawer, table, timeline };
  },
};
</script>

<style lang="less">
.data-panel {
  background-color: var(--body-background);
}

.timeline-wrapper {
  box-sizing: border-box;
  padding: 5px 10px;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>

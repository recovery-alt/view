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
            <a-button v-if="item.btnText" type="primary" size="small" @click="item.event">
              {{ item.btnText }}
            </a-button>
            <ReloadOutlined v-else @click="item.event" />
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
    <code-mirror v-model:viewer="viewer" v-model:doc="dataStringify" class="code-box" readonly />
    <a-table :data-source="table.data" :columns="table.columns" :pagination="false" />
    <a-drawer
      v-model:visible="drawer.show"
      placement="right"
      title="设置数据源"
      :width="400"
      @close="handleDrawerClose"
    >
      <div class="data-panel__drawer-row">
        <div>
          <label class="data-panel__label">数据源类型：</label>
          <a-select v-model:value="drawer.selected" size="small">
            <a-select-option v-for="item in drawer.options" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <a-button type="primary" size="small">获取数据</a-button>
      </div>
      <div class="data-panel__drawer-row">
        <div>
          <label class="data-panel__label">开启过滤器：</label>
          <a-switch v-model:checked="drawer.openFilter" />
        </div>
        <a-button type="primary" size="small" @click="modal.show = true">设置过滤器</a-button>
      </div>
      <code-mirror v-model:viewer="drawer.viewer" v-model:doc="dataStringify" />
      <a-table :data-source="table.data" :columns="table.columns" :pagination="false" />
    </a-drawer>
    <a-modal v-model:visible="modal.show" title="过滤器" :z-index="1001">
      <code-mirror v-model:viewer="modal.viewer" v-model:doc="modal.doc" type="javascript" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import type { DataSourceKey } from '@/config';
import { useStore } from '@/store';
import { computed, onMounted, reactive, ref, shallowReactive, shallowRef } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { generateColumns } from '@/utils';
import { CodeMirror } from '@/components';
import type { EditorView } from '@codemirror/basic-setup';
import json from 'json5';
import { useDrawer } from '@/hooks';

const store = useStore();
const { board } = store.state;
const viewer = shallowRef<EditorView>();
const dataStringify = ref<string>();

const modal = shallowReactive<{ show: boolean; doc: string; viewer?: EditorView }>({
  show: false,
  doc: `function filter(data) {
  return data;
}`,
});

const curComponent = computed(() => board.data[board.selected[0]]);

const { drawer, handleDrawerClose } = useDrawer(dataStringify, curComponent);

const table = reactive({
  data: [
    {
      key: 'x',
      mapping: '-',
      status: '匹配成功',
    },
    {
      key: 'y',
      mapping: '-',
      status: '匹配成功',
    },
    {
      key: 'z',
      mapping: '-',
      status: '匹配成功',
    },
  ],
  columns: generateColumns([
    {
      title: '字段',
      key: 'key',
    },
    {
      title: '映射',
      key: 'mapping',
    },
    {
      title: '状态',
      key: 'status',
    },
  ]),
});

const timeline = reactive([
  {
    actived: true,
    text: curComponent.value.dataset?.type,
    btnText: '设置数据源',
    event: () => {
      drawer.show = true;
      // TODO
      console.log(curComponent.value);
    },
  },
  {
    actived: !!curComponent.value.dataset?.filter,
    text: '数据过滤器',
    btnText: '添加过滤器',
    event: () => {
      modal.show = true;
    },
  },
  {
    actived: true,
    text: '数据响应结果（只读）',
    event: () => {
      // TODO
    },
  },
]);

const resolveDataset = () => {
  const { dataset } = curComponent.value;
  if (!dataset) return;
  const { type, static: data } = dataset;

  const strategy: Record<DataSourceKey, () => void> = {
    url: () => {
      // TODO
    },
    static: () => {
      dataStringify.value = json.stringify(data);
    },
  };
  const handler = strategy[type] || strategy.static;
  handler();
};

onMounted(() => {
  resolveDataset();
});
</script>

<style lang="less">
.data-panel {
  background-color: var(--body-bg);

  &__drawer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__label {
    margin-right: 5px;
  }

  .timeline-wrapper {
    box-sizing: border-box;
    padding: 0 10px;
    padding-top: 10px;

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .code-box {
    margin: 0 10px;
  }
}
</style>

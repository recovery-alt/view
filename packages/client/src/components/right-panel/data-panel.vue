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
      v-if="curComponent.data"
      v-model:visible="drawer.show"
      placement="right"
      title="设置数据源"
      :width="400"
      @close="handleDrawerClose"
    >
      <a-form label-align="right" :label-col="{ span: 6 }" :wrapper-col="{ span: 17, offset: 1 }">
        <a-form-item label="数据源类型">
          <a-row justify="space-between">
            <a-col>
              <a-select
                v-model:value="curComponent.data.type"
                size="small"
                @change="handleDataTypeChange"
              >
                <a-select-option
                  v-for="item in drawer.options"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col offset="2">
              <a-button v-if="curComponent.data.type === 'url'" type="primary" size="small">
                获取数据
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="开启过滤器">
          <a-row justify="space-between">
            <a-col>
              <a-switch v-model:checked="drawer.openFilter" @change="handleFilterChange" />
            </a-col>
            <a-col offset="2">
              <a-button type="primary" size="small" @click="modal.show = true">设置过滤器</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="curComponent.data.type === 'url'" label="接口地址">
          <a-input v-model="curComponent.data.url" />
        </a-form-item>
      </a-form>
      <a-divider></a-divider>
      <a-table :data-source="table.data" :columns="table.columns" :pagination="false" />
      <a-divider orientation="right"> 响应结果 <ReloadOutlined /> </a-divider>
      <code-mirror v-model:viewer="drawer.viewer" v-model:doc="dataStringify" />
    </a-drawer>
    <a-modal
      v-model:visible="modal.show"
      title="过滤器"
      :z-index="1001"
      @ok="handleFilterChange(true)"
    >
      <code-mirror v-model:viewer="modal.viewer" v-model:doc="modal.doc" type="javascript" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import type { DataSourceKey } from '@/config';
import { useStore } from '@/store';
import { computed, onMounted, reactive, ref, shallowReactive, shallowRef, watchEffect } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { generateColumns } from '@/utils';
import { CodeMirror } from '@/components';
import type { EditorView } from '@codemirror/basic-setup';
import json from 'json5';
import { useDrawer } from '@/hooks';
import { DataSource } from '@/config';

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

const table = shallowReactive<{ data: Array<Data>; columns: Data<any> }>({
  data: [],
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
    text: DataSource[curComponent.value.data!.type],
    btnText: '设置数据源',
    event: () => {
      drawer.show = true;
      drawer.openFilter = !!curComponent.value.data!.filter;
    },
  },
  {
    actived: !!curComponent.value.data!.filter,
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
  if (!curComponent.value) return;
  const { data } = curComponent.value;
  if (!data) return;
  const { type, static: dataset } = data;

  const strategy: Record<DataSourceKey, () => void> = {
    url() {
      // TODO
    },
    static() {
      dataStringify.value = json.stringify(dataset);
    },
  };
  const handler = strategy[type] || strategy.static;
  handler();
};

const handleFilterChange = (open: boolean) => {
  const { data } = curComponent.value;
  if (!data) return;
  if (open) {
    data.filter = modal.doc;
    drawer.openFilter = !!curComponent.value.data!.filter;
    modal.show = false;
  } else {
    delete data.filter;
  }
};

const handleDataTypeChange = (type: DataSourceKey) => {
  const strategy = {
    url() {
      // TODO
    },
    static() {
      // TODO
    },
  };

  const handler = strategy[type];

  handler();
};

watchEffect(() => {
  if (!curComponent.value) return;
  const { data } = curComponent.value;
  if (data) {
    timeline[0].text = DataSource[data!.type];
    timeline[1].actived = !!data.filter;
  }
});

watchEffect(() => {
  if (!curComponent.value) return;
  const { data } = curComponent.value;
  if (data?.static?.[0]) {
    table.data = Object.keys(data.static[0]).map(key => ({
      key,
      mapping: '-',
      status: '匹配成功',
    }));
  }
});

onMounted(() => {
  watchEffect(() => {
    resolveDataset();
  });
});
</script>

<style lang="less">
.data-panel {
  background-color: var(--body-bg);

  &__drawer {
    &-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    &-input {
      flex: 1;
    }
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

.ant-drawer-body .ant-divider-inner-text span:hover {
  color: var(--primary-color);
}
</style>

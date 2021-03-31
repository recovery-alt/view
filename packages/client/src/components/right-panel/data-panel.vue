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
    <code-mirror
      v-model="viewer"
      class="code-box"
      :doc="JSON.stringify(curComponent.dataset?.data)"
    />
    <a-table :data-source="table.data" :columns="table.columns" :pagination="false" />
    <a-drawer v-model:visible="drawer.show" placement="right" title="设置数据源" :width="400">
      <div class="data-panel__drawer-row">
        <div>
          <label class="data-panel__label">数据源类型：</label>
          <a-select v-model:value="selected" size="small">
            <a-select-option v-for="item in options" :key="item.id" :value="item.id">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <a-button type="primary" size="small">获取数据</a-button>
      </div>
      <div class="data-panel__drawer-row">
        <div>
          <label class="data-panel__label">开启过滤器：</label>
          <a-switch v-model:checked="openFilter" />
        </div>
        <a-button type="primary" size="small" @click="showModal = true">设置过滤器</a-button>
      </div>
      <code-mirror v-model="drawerViewer" />
      <a-table :data-source="table.data" :columns="table.columns" :pagination="false" />
    </a-drawer>
    <a-modal v-model:visible="showModal" title="过滤器" :z-index="1001">
      <code-mirror v-model="modalViewer" type="javascript" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { computed, reactive, ref, shallowRef } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { generateColumns } from '@/utils';
import { CodeMirror } from '@/components';
import { EditorView } from '@codemirror/basic-setup';

export default {
  name: 'data-panel',
  components: { ReloadOutlined, CodeMirror },
  setup() {
    const store = useStore();
    const { board } = store.state;
    const viewer = shallowRef<EditorView>();
    const drawerViewer = shallowRef<EditorView>();
    const modalViewer = shallowRef<EditorView>();

    const drawer = reactive({
      show: false,
    });

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

    const curComponent = computed(() => {
      return board.data[board.selected[0]];
    });

    const timeline = reactive([
      {
        actived: true,
        text: '静态数据',
        btnText: '设置数据源',
        event: () => {
          drawer.show = true;
        },
      },
      {
        actived: false,
        text: '数据过滤器',
        btnText: '添加过滤器',
        event: () => {
          showModal.value = true;
        },
      },
      { actived: true, text: '数据响应结果（只读）', icon: 'ReloadOutlined', event: () => null },
    ]);

    const selected = ref(0);

    const options = [
      { id: 0, label: '静态数据' },
      { id: 1, label: '接口请求' },
    ];

    const openFilter = ref(false);
    const showModal = ref(false);

    return {
      viewer,
      drawerViewer,
      modalViewer,
      curComponent,
      drawer,
      table,
      timeline,
      selected,
      options,
      openFilter,
      showModal,
    };
  },
};
</script>

<style lang="less">
.data-panel {
  background-color: var(--body-background);

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

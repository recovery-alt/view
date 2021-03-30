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
            <a-button v-if="item.btnText" type="primary" size="small">
              {{ item.btnText }}
            </a-button>
            <ReloadOutlined v-else />
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
    <div ref="codeBox" class="code-box"></div>
    <a-table :data-source="table.data" :columns="table.columns" :pagination="false" />
    <a-drawer v-model:visible="drawer.show" placement="right" :width="400"></a-drawer>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { computed, onMounted, reactive, ref } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { basicSetup, EditorView, EditorState } from '@codemirror/basic-setup';
import { language } from '@codemirror/language';
import { jsonLanguage } from '@codemirror/lang-json';
import { generateColumns } from '@/utils';

export default {
  name: 'data-panel',
  components: { ReloadOutlined },
  setup() {
    const store = useStore();
    const { board } = store.state;

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

    const timeline = reactive([
      { actived: true, text: '静态数据', btnText: '配置数据源' },
      { actived: false, text: '数据过滤器', btnText: '添加过滤器' },
      { actived: true, text: '数据响应结果（只读）', icon: 'ReloadOutlined' },
    ]);

    const curComponent = computed(() => {
      return board.data[board.selected[0]];
    });

    const codeBox = ref<HTMLElement | null>(null);
    let state: EditorState, view: EditorView;

    onMounted(() => {
      if (!codeBox.value) return;
      state = EditorState.create({
        extensions: [basicSetup, language.of(jsonLanguage)],
      });
      view = new EditorView({ state, parent: codeBox.value });
    });

    return { curComponent, drawer, table, timeline, codeBox };
  },
};
</script>

<style lang="less">
.data-panel {
  background-color: var(--body-background);
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
  overflow: auto;
  height: 200px;
  margin: 0 10px;
  margin-bottom: 5px;
  border: 1px solid var(--border-color-base);

  .cm-editor {
    height: 100%;
  }

  .ͼ1.cm-focused {
    outline: none;
  }
}
</style>

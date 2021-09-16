import type { Component, Data } from '@/typings';
import { ComputedRef, onMounted, reactive, Ref, watchEffect } from 'vue';
import type { DataSourceKey } from '@/config';
import { EditorView } from '@codemirror/basic-setup';
import { shallowReactive } from 'vue';
import json from 'json5';
import { DataSource } from '@/config';
import { isUrl, callFilter, generateColumns } from '@/utils';
import { format } from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

type Drawer = {
  show: boolean;
  openFilter: boolean;
  options: Array<{ value: DataSourceKey; label: string }>;
  viewer?: EditorView;
};

type Modal = { show: boolean; doc: string; viewer?: EditorView };

export function useDrawer(
  dataStringify: Ref<string | undefined>,
  curComponent: ComputedRef<Component>
) {
  const drawer = shallowReactive<Drawer>({
    openFilter: false,
    show: false,
    options: Object.keys(DataSource).map(key => {
      const value = key as DataSourceKey;
      return { value, label: DataSource[value] };
    }),
  });

  function refreshData() {
    if (!drawer.viewer) return;
    const doc = drawer.viewer.state.doc.toJSON();
    dataStringify.value = doc.reduce((acc, val) => acc + val, '');
    if (curComponent.value.data) {
      curComponent.value.data.static = json.parse(dataStringify.value);
    }
  }

  function fetchUrl(url?: string) {
    if (url && isUrl(url)) {
      return new Promise<void>((resolve, reject) => {
        fetch(url)
          .then(res => res.json())
          .then(res => {
            dataStringify.value = format(JSON.stringify(res), {
              parser: 'json5',
              plugins: [parserBabel],
            });
            resolve();
          })
          .catch(() => {
            reject();
            dataStringify.value = format('{code: 1, msg: "接口请求错误"}', {
              parser: 'json5',
              plugins: [parserBabel],
            });
          });
      });
    }
  }

  async function resolveData(init = false) {
    if (!curComponent.value?.data) return;
    const { url, type, static: dataset, filter } = curComponent.value.data;
    const strategy = {
      url: fetchUrl,
      static: init ? () => (dataStringify.value = json.stringify(dataset)) : refreshData,
    };

    const handler = strategy[type];
    await handler(url);
    if (filter) dataStringify.value = callFilter(filter, dataStringify.value);
  }

  onMounted(() => {
    watchEffect(() => {
      resolveData(true);
    });
  });

  return { drawer, refreshData, resolveData };
}

export function useModal(curComponent: ComputedRef<Component>, drawer: Drawer) {
  const modal = shallowReactive<Modal>({
    show: false,
    doc: `function filter(data) {
    return data;
  }`,
  });

  const handleFilterChange = (open: boolean | string | number) => {
    const { data } = curComponent.value;
    if (!data || !modal.viewer) return;
    if (open) {
      data.filter = modal.viewer.state.doc.sliceString(0);
      drawer.openFilter = !!curComponent.value.data!.filter;
      modal.show = false;
    } else {
      delete data.filter;
    }
  };

  return { modal, handleFilterChange };
}

export function useTimeline(curComponent: ComputedRef<Component>, drawer: Drawer, modal: Modal) {
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

  watchEffect(() => {
    if (!curComponent.value) return;
    const { data } = curComponent.value;
    if (data) {
      timeline[0].text = DataSource[data!.type];
      timeline[1].actived = !!data.filter;
    }
  });

  return { timeline };
}

export function useTable(curComponent: ComputedRef<Component>) {
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
  return { table };
}

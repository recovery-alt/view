import type { Data } from '@/typings';
import { onMounted, reactive, Ref, watchEffect } from 'vue';
import type { DataSourceKey } from '@/config';
import { EditorView } from '@codemirror/basic-setup';
import { shallowReactive } from 'vue';
import json from 'json5';
import { DataSource } from '@/config';
import { isUrl, callFilter, generateColumns } from '@/utils';
import { format } from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import { useBoardStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { dataPanel as messages } from '@/locales';

type Drawer = {
  show: boolean;
  openFilter: boolean;
  options: Array<{ value: DataSourceKey; label: string }>;
  viewer?: EditorView;
  readonlyViewer?: EditorView;
};

type Modal = { show: boolean; doc: string; viewer?: EditorView };

export function useDrawer(dataStringify: Ref<string | undefined>) {
  const board = useBoardStore();
  const drawer = shallowReactive<Drawer>({
    openFilter: false,
    show: false,
    options: DataSource.map((value, i) => ({ value, label: DataSource[i] })),
  });

  function refreshData() {
    if (!drawer.viewer) return;
    const doc = drawer.viewer.state.doc.toJSON();
    dataStringify.value = doc.reduce((acc, val) => acc + val, '');
    if (board.curCom?.data) {
      board.curCom.data.static = json.parse(dataStringify.value);
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
    if (!board.curCom?.data) return;
    const { url, type, static: dataset, filter } = board.curCom.data;
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

export function useModal(drawer: Drawer) {
  const board = useBoardStore();
  const modal = shallowReactive<Modal>({
    show: false,
    doc: `function filter(data) {
    return data;
  }`,
  });

  const handleFilterChange = (open: boolean | string | number) => {
    const data = board.curCom?.data;
    if (!data || !modal.viewer) return;
    if (open) {
      data.filter = modal.viewer.state.doc.sliceString(0);
      drawer.openFilter = !!board.curCom.data!.filter;
      modal.show = false;
    } else {
      delete data.filter;
    }
  };

  return { modal, handleFilterChange };
}

export function useTimeline(drawer: Drawer, modal: Modal) {
  const board = useBoardStore();
  const { t } = useI18n({ useScope: 'local', messages });
  const timeline = reactive([
    {
      actived: true,
      text: t(board.curCom!.data!.type),
      btnText: t('configDataSource'),
      event: () => {
        drawer.show = true;
        drawer.openFilter = !!board.curCom!.data!.filter;
      },
    },
    {
      actived: !!board.curCom!.data!.filter,
      text: t('dataFilter'),
      btnText: t('addFilter'),
      event: () => {
        modal.show = true;
      },
    },
    {
      actived: true,
      text: t('result'),
      event: () => {
        // TODO
      },
    },
  ]);

  watchEffect(() => {
    if (!board.curCom) return;
    const { data } = board.curCom;
    if (data) {
      timeline[0].text = t(data!.type);
      timeline[1].actived = !!data.filter;
    }
  });

  return { timeline };
}

export function useTable() {
  const board = useBoardStore();
  const { t } = useI18n({ useScope: 'local', messages });
  const table = reactive<{ data: Array<Data>; columns: ReturnType<typeof generateColumns> }>({
    data: [],
    columns: generateColumns([
      {
        title: t('key'),
        key: 'key',
      },
      {
        title: t('mapping'),
        key: 'mapping',
      },
      {
        title: t('status'),
        key: 'status',
      },
    ]),
  });

  watchEffect(() => {
    if (!board.curCom) return;
    const { data } = board.curCom;
    if (data?.static?.[0]) {
      table.data = Object.keys(data.static[0]).map(key => ({
        key,
        mapping: '-',
        status: t('matchSuccess'),
      }));
    }
  });
  return { table };
}

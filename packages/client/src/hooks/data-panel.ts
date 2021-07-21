import type { Component } from '@/typings';
import type { ComputedRef, Ref } from 'vue';
import type { DataSourceKey } from '@/config';
import { EditorView } from '@codemirror/basic-setup';
import { shallowReactive } from 'vue';
import json from 'json5';
import { DataSource } from '@/config';
import { isUrl } from '@/utils';
import { format } from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

export const useDrawer = (
  dataStringify: Ref<string | undefined>,
  curComponent: ComputedRef<Component>
) => {
  const drawer = shallowReactive<{
    show: boolean;
    openFilter: boolean;
    options: Array<{ value: DataSourceKey; label: string }>;
    viewer?: EditorView;
  }>({
    openFilter: false,
    show: false,
    options: Object.keys(DataSource).map(key => {
      const value = key as DataSourceKey;
      return { value, label: DataSource[value] };
    }),
  });

  const modal = shallowReactive<{ show: boolean; doc: string; viewer?: EditorView }>({
    show: false,
    doc: `function filter(data) {
    return data;
  }`,
  });

  const refreshData = () => {
    if (!drawer.viewer) return;
    const doc = drawer.viewer.state.doc.toJSON();
    dataStringify.value = doc.reduce((acc, val) => acc + val, '');
    if (curComponent.value.data) {
      curComponent.value.data.static = json.parse(dataStringify.value);
    }
  };

  const handleFilterChange = (open: boolean | string | number) => {
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

  const fetchData = () => {
    if (!curComponent.value?.data) return;
    const { url, type } = curComponent.value.data;
    const strategy = {
      url() {
        if (url && isUrl(url)) {
          fetch(url)
            .then(res => res.json())
            .then(res => {
              dataStringify.value = format(JSON.stringify(res), {
                parser: 'json5',
                plugins: [parserBabel],
              });
            })
            .catch(() => {
              dataStringify.value = format('{code: 1, msg: "接口请求错误"}', {
                parser: 'json5',
                plugins: [parserBabel],
              });
            });
        }
      },
      static: refreshData,
    };

    const handler = strategy[type];

    handler();
  };

  return { drawer, modal, refreshData, handleFilterChange, fetchData };
};

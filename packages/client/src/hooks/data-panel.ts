import type { Component } from '@/typings';
import type { ComputedRef, Ref } from 'vue';
import type { DataSourceKey } from '@/config';
import { EditorView } from '@codemirror/basic-setup';
import { shallowReactive } from 'vue';
import json from 'json5';
import { DataSource } from '@/config';

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

  const handleDrawerClose = () => {
    if (!drawer.viewer) return;
    const doc = drawer.viewer.state.doc.toJSON();
    dataStringify.value = doc.reduce((acc, val) => acc + val, '');
    if (curComponent.value.data) {
      curComponent.value.data.static = json.parse(dataStringify.value);
    }
  };

  return { drawer, handleDrawerClose };
};

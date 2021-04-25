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
    selected: number;
    openFilter: boolean;
    options: { value: DataSourceKey; label: string }[];
    viewer?: EditorView;
  }>({
    selected: 0,
    openFilter: false,
    show: false,
    options: Object.values(DataSource).map(key => {
      const value = key as DataSourceKey;
      return { value, label: DataSource[value] };
    }),
  });

  const handleDrawerClose = () => {
    if (!drawer.viewer) return;
    const doc = drawer.viewer.state.doc.toJSON();
    dataStringify.value = doc.reduce((acc, val) => acc + val, '');
    if (curComponent.value.dataset) {
      curComponent.value.dataset.static = json.parse(dataStringify.value);
    }
  };

  return { drawer, handleDrawerClose };
};

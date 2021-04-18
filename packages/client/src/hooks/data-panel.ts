import type { ComputedRef, Ref } from 'vue';
import { DataSource } from '@/enum';
import { EditorView } from '@codemirror/basic-setup';
import { shallowReactive } from 'vue';
import json from 'json5';

export const useDrawer = (
  dataStringify: Ref<string | undefined>,
  curComponent: ComputedRef<Component>
) => {
  const drawer = shallowReactive<{
    show: boolean;
    selected: number;
    openFilter: boolean;
    options: { value: number; label: DataSource }[];
    viewer?: EditorView;
  }>({
    selected: 0,
    openFilter: false,
    show: false,
    options: [
      { value: 0, label: DataSource.STATIC },
      { value: 1, label: DataSource.URL },
    ],
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

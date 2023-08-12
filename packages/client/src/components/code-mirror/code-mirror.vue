<template>
  <div ref="cm" class="code-mirror"></div>
</template>

<script lang="ts" setup>
import type { Data } from '@/typings';
import type { PropType } from 'vue';
import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { language, LRLanguage } from '@codemirror/language';
import { jsonLanguage } from '@codemirror/lang-json';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { onMounted, watchEffect, shallowRef } from 'vue';
import { oneDarkTheme, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { useThemeStore } from '@/store';
import { theme } from 'ant-design-vue';
import { format } from '@/utils';

const props = defineProps({
  viewer: {
    type: Object as PropType<EditorView>,
    default: () => new EditorView(),
  },
  type: {
    type: String,
    default: () => 'json',
  },
  doc: {
    type: String,
    default: () => '',
  },
  readonly: {
    type: Boolean,
    default: () => false,
  },
});

const emit = defineEmits(['update:viewer']);
const themeStore = useThemeStore();
const { token } = theme.useToken();

const themeExtensions = {
  light: [defaultHighlightStyle],
  dark: [oneDarkTheme, oneDarkHighlightStyle],
};

const cm = shallowRef<HTMLElement>();

const strategy: Data<LRLanguage> = {
  json: jsonLanguage,
  javascript: javascriptLanguage,
};

const parser = props.type === 'json' ? 'json5' : 'babel';

watchEffect(async () => {
  const doc = await format(props.doc, parser);
  const lang = strategy[props.type] || strategy.json;
  const state = EditorState.create({
    doc,
    extensions: [
      basicSetup,
      language.of(lang),
      EditorView.editable.of(!props.readonly),
      ...themeExtensions[themeStore.value],
    ],
  });
  props.viewer.setState(state);
});

onMounted(() => {
  if (!cm.value) return;
  emit('update:viewer', new EditorView({ parent: cm.value }));
});
</script>

<style lang="less" scoped>
.code-mirror {
  border: 1px solid v-bind('token.colorBorder');
  @apply overflow-auto h-200px mb-5px;

  :deep {
    .cm-editor {
      @apply h-full;
    }

    .ͼ1.cm-focused {
      @apply outline-none;
    }
  }
}
</style>

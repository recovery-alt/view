<template>
  <div ref="cm" class="code-mirror"></div>
</template>

<script lang="ts">
import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { language, LezerLanguage } from '@codemirror/language';
import { jsonLanguage } from '@codemirror/lang-json';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { onMounted, PropType, ref, defineComponent, watchEffect } from 'vue';
import { format } from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

export default defineComponent({
  name: 'code-mirror',
  props: {
    viewer: Object as PropType<EditorView>,
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
  },
  emits: ['update:viewer'],
  setup(props, { emit }) {
    const cm = ref<HTMLElement>();

    const strategy: Data<LezerLanguage> = {
      json: jsonLanguage,
      javascript: javascriptLanguage,
    };

    const parser = props.type === 'json' ? 'json' : 'babel';

    watchEffect(() => {
      const doc = format(props.doc, { parser, plugins: [parserBabel] });
      const lang = strategy[props.type] || strategy.json;
      const state = EditorState.create({
        doc,
        extensions: [basicSetup, language.of(lang), EditorView.editable.of(!props.readonly)],
      });
      props.viewer?.setState(state);
    });

    onMounted(() => {
      if (!cm.value) return;
      emit('update:viewer', new EditorView({ parent: cm.value }));
    });

    return { cm };
  },
});
</script>

<style lang="less" scoped>
.code-mirror {
  overflow: auto;
  height: 200px;
  margin-bottom: 5px;
  border: 1px solid var(--border-color-base);

  :deep(.cm-editor) {
    height: 100%;
  }

  :deep(.ͼ1.cm-focused) {
    outline: none;
  }
}
</style>

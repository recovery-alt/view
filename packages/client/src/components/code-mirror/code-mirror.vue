<template>
  <div ref="cm" class="code-mirror"></div>
</template>

<script lang="ts">
import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { language, LezerLanguage } from '@codemirror/language';
import { jsonLanguage } from '@codemirror/lang-json';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { onMounted, PropType, ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'code-mirror',
  props: {
    modelValue: Object as PropType<EditorView>,
    type: {
      type: String,
      default: () => 'json',
    },
    doc: {
      type: String,
      default: () => '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const cm = ref<HTMLElement>();

    const strategy: Data<LezerLanguage> = {
      json: jsonLanguage,
      javascript: javascriptLanguage,
    };

    onMounted(() => {
      if (!cm.value) return;
      const lang = strategy[props.type] || strategy.json;
      const state = EditorState.create({
        doc: props.doc,
        extensions: [basicSetup, language.of(lang)],
      });
      emit('update:modelValue', new EditorView({ state, parent: cm.value }));
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

<template>
  <div class="page-config">
    <header class="page-config__header">页面设置</header>
    <section class="page-config__wrapper">
      <a-form :model="form" hide-required-mark :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="页面标题" v-bind="validateInfos.title">
          <a-input v-model:value="form.title" size="small" />
        </a-form-item>
        <a-form-item label="页面描述" v-bind="validateInfos.description">
          <a-textarea v-model:value="form.description" size="small"></a-textarea>
        </a-form-item>
        <a-form-item label="屏幕尺寸" v-bind="validateInfos.width">
          <a-row>
            <a-col span="8">
              <a-input-number v-model:value="form.width" size="small" />
            </a-col>
            <a-col span="8" offset="4">
              <a-input-number v-model:value="form.height" size="small" />
            </a-col>
          </a-row>
          <template #extra>
            <div class="page-config__extra">
              <span>宽度</span>
              <span>高度</span>
            </div>
          </template>
        </a-form-item>
        <a-form-item label="背景颜色" v-bind="validateInfos.backgroundColor">
          <color-picker v-model="form.backgroundColor" />
        </a-form-item>
        <a-form-item label="缩放方式" v-bind="validateInfos.backgroundColor">
          <color-picker v-model="form.backgroundColor" />
        </a-form-item>
        <a-form-item label="栅格间距" v-bind="validateInfos.backgroundColor">
          <color-picker v-model="form.backgroundColor" />
        </a-form-item>
      </a-form>
    </section>
  </div>
</template>

<script lang="ts">
import { usePageConfig } from '@/hooks';
import ColorPicker from '@/components/color-picker';

export default {
  name: 'page-config',
  components: { ColorPicker },
  setup() {
    const {
      pageConfig,
      showPageConfig,
      form,
      resetFields,
      validate,
      validateInfos,
      savePageConfig,
    } = usePageConfig();

    return { pageConfig, showPageConfig, form, validateInfos, savePageConfig };
  },
};
</script>

<style lang="less">
.page-config {
  &__header {
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: var(--normal-color);
  }

  &__wrapper {
    height: calc(100% - 30px);
    overflow: auto;
  }

  &__extra {
    width: 100%;
    display: flex;

    span {
      flex: 1;
    }
  }
}
</style>

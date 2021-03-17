<template>
  <div class="page-config">
    <header class="page-config__header">页面设置</header>
    <section class="page-config__wrapper">
      <a-form
        :model="pageConfig"
        hide-required-mark
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item label="页面标题" v-bind="validateInfos.title">
          <a-input v-model:value="pageConfig.title" size="small" />
        </a-form-item>
        <a-form-item label="页面描述">
          <a-textarea v-model:value="pageConfig.description" size="small"></a-textarea>
        </a-form-item>
        <a-form-item label="屏幕尺寸" v-bind="validateInfos.width">
          <a-row>
            <a-col span="8">
              <a-input-number v-model:value="pageConfig.width" size="small" />
            </a-col>
            <a-col span="8" offset="4">
              <a-input-number v-model:value="pageConfig.height" size="small" />
            </a-col>
          </a-row>
          <template #extra>
            <div class="page-config__extra">
              <span>宽度</span>
              <span>高度</span>
            </div>
          </template>
        </a-form-item>
        <a-form-item label="背景颜色">
          <color-picker v-model="pageConfig.backgroundColor" />
        </a-form-item>
        <a-form-item label="背景图片">
          <a-input v-model:value="pageConfig.url" size="small" placeholder="图片地址" />
        </a-form-item>
        <a-form-item label="缩放方式">
          <a-tooltip
            v-for="(item, i) in zoomOptions"
            :key="item.icon"
            :title="item.tip"
            placement="bottom"
          >
            <a-button
              class="page-config__btn"
              size="small"
              :type="pageConfig.zoom === i ? 'primary' : 'default'"
              @click="pageConfig.zoom = i"
            >
              <component :is="item.icon" />
            </a-button>
          </a-tooltip>
        </a-form-item>
        <a-form-item label="栅格间距">
          <a-input-number v-model:value="pageConfig.gap" size="small" />
        </a-form-item>
      </a-form>
    </section>
  </div>
</template>

<script lang="ts">
import { ColorPicker } from '@/components';
import { ref, reactive } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { pageConfig } from '@/hooks';
import {
  ExpandOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  DragOutlined,
  StopOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'page-config',
  components: {
    ColorPicker,
    ExpandOutlined,
    ColumnWidthOutlined,
    ColumnHeightOutlined,
    DragOutlined,
    StopOutlined,
  },
  setup() {
    const showPageConfig = ref(false);
    const rules = reactive({
      title: [{ required: true, message: '标题为必填项' }],
      width: [{ required: true, message: '页面宽为必填项' }],
      height: [{ required: true, message: '页面高为必填项' }],
    });

    const zoomOptions = [
      { icon: 'ExpandOutlined', tip: '全屏铺满' },
      { icon: 'ColumnWidthOutlined', tip: '等比缩放宽度铺满' },
      { icon: 'ColumnHeightOutlined', tip: '等比缩放高度铺满' },
      { icon: 'DragOutlined', tip: '等比缩放高度铺满（可滚动）' },
      { icon: 'StopOutlined', tip: '不缩放' },
    ];

    const { validate, validateInfos } = useForm(pageConfig, rules);

    return { pageConfig, showPageConfig, validateInfos, zoomOptions };
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

  &__btn {
    margin-left: 10px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>

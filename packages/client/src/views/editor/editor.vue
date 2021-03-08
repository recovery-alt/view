<template>
  <header class="header">
    <div class="logo-box">
      <img width="40" height="40" src="/src/assets/img/logo.svg" />
    </div>
    <div>
      <a-tooltip v-for="item in buttonGroup" :key="item.name" placement="bottom" :title="item.name">
        <component :is="item.icon" class="header-icon" @click="item.event" />
      </a-tooltip>
    </div>
    <div class="header-right">
      <a-popover v-model:visible="showPageConfig" title="页面设置" trigger="click">
        <template #content>
          <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="标题" :rules="rules.title">
              <a-input v-model:value="form.title" size="small" />
            </a-form-item>
            <a-form-item label="描述">
              <a-textarea v-model:value="form.description" size="small"></a-textarea>
            </a-form-item>
            <a-form-item label="宽" :rules="rules.width">
              <a-input v-model:value="form.width" size="small" />
            </a-form-item>
            <a-form-item label="高" :rules="rules.height">
              <a-input v-model:value="form.height" size="small" />
            </a-form-item>
            <a-form-item label="背景色">
              <color-picker v-model="form.bgColor" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 8, offset: 8 }">
              <a-button type="primary" @click="savePageConfig">保存</a-button>
            </a-form-item>
          </a-form>
        </template>
        <a-button type="primary">页面设置</a-button>
      </a-popover>
      <exit-dropdown />
    </div>
  </header>
  <main class="main">
    <left-panel />
    <section class="main-mid">
      <div class="mid-box">
        <board :style="patchUnit({ width: pageConfig.width, height: pageConfig.height })" />
      </div>
    </section>
    <right-panel />
  </main>
  <board-preview v-model="modalOpen" />
</template>

<script lang="ts">
import LeftPanel from '@/components/left-panel';
import Board, { BoardPreview } from '@/components/board';
import { SnapshotEnum } from '@/store/modules/snapshot';
import { patchUnit } from '@/utils';
import { BoardEnum } from '@/store/modules/board';
import RightPanel from '@/components/right-panel';
import { useStore } from '@/store';
import { usePage, usePageConfig } from '@/hooks';
import { ref } from 'vue';
import ExitDropdown from '@/components/exit-dropdown';
import ColorPicker from '@/components/color-picker';
import {
  LeftOutlined,
  RightOutlined,
  ScissorOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

export default {
  name: 'editor',
  components: {
    LeftPanel,
    Board,
    RightPanel,
    BoardPreview,
    LeftOutlined,
    RightOutlined,
    ScissorOutlined,
    CopyOutlined,
    DeleteOutlined,
    FileDoneOutlined,
    PlaySquareOutlined,
    ExitDropdown,
    ColorPicker,
  },
  props: { id: { type: String, default: () => '' } },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const undo = () => store.dispatch(SnapshotEnum.UNDO);
    const redo = () => store.dispatch(SnapshotEnum.REDO);
    const cut = () => store.dispatch(BoardEnum.CUT);
    const copy = () => store.dispatch(BoardEnum.COPY);
    const del = () => store.dispatch(BoardEnum.DEL);

    const modalOpen = ref(false);
    const { pageConfig, showPageConfig, form, rules, savePageConfig } = usePageConfig();
    const { savePage } = usePage(store, router, props.id);

    const buttonGroup = [
      { name: '上一步', icon: 'left-outlined', event: undo },
      { name: '下一步', icon: 'right-outlined', event: redo },
      { name: '剪切', icon: 'scissor-outlined', event: cut },
      { name: '复制', icon: 'copy-outlined', event: copy },
      { name: '删除', icon: 'delete-outlined', event: del },
      {
        name: '保存',
        icon: 'file-done-outlined',
        event: () => savePage(),
      },
      {
        name: '预览',
        icon: 'play-square-outlined',
        event: () => {
          modalOpen.value = true;
        },
      },
    ];

    return {
      patchUnit,
      buttonGroup,
      modalOpen,
      showPageConfig,
      pageConfig,
      form,
      rules,
      savePageConfig,
    };
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 48px;
  border-bottom: 1px solid @border-color-base;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;

  &-icon {
    font-size: 20px;
    margin-left: 20px;
    color: @primary-8;
    &:hover {
      color: @success-color;
    }
  }

  &-right {
    display: flex;
    align-items: center;
  }
}

.main {
  height: calc(100% - 60px);
  display: flex;

  &-mid {
    flex: 1;
    height: 100%;
    background-color: @descriptions-bg;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
  }
}

.mid-box {
  height: 100%;
  overflow: auto;
}

.logo {
  margin-left: 5px;
  font-size: 20px;
  color: @primary-8;
  font-weight: bold;

  &-box {
    display: flex;
    align-items: center;
  }
}
</style>

<template>
  <header class="header">
    <img width="40" height="40" src="/src/assets/img/logo.svg" @click="$router.push('/')" />
    <div class="header__wrapper">
      <div class="header__panel-box">
        <a-button
          v-for="item in panelStatus"
          :key="item.key"
          class="header__button"
          size="small"
          :type="item.checked ? 'primary' : 'default'"
          @click="switchPanelShow(item.key)"
        >
          <template #icon>
            <component :is="item.icon" />
          </template>
        </a-button>
      </div>
      <div class="header__publish">
        <a-tooltip
          v-for="item in buttonGroup"
          :key="item.icon"
          :title="item.name"
          placement="bottom"
        >
          <a-button class="header__button" size="small" @click="item.event">
            <template #icon>
              <component :is="item.icon" />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <div class="header__title">
      <FundProjectionScreenOutlined />
      <span>{{ pageConfig.title }}</span>
    </div>
  </header>
  <main class="main">
    <layer-panel />
    <component-panel />
    <section class="mid-panel">
      <header class="mid-panel__toolbar"></header>
      <div class="mid-panel__wrapper">
        <section class="canvas-main">
          <board />
        </section>
      </div>
    </section>
    <right-panel />
  </main>
  <board-preview v-model="modalOpen" />
</template>

<script lang="ts">
import { patchUnit, on } from '@/utils';
import { useStore, SnapshotEnum, BoardEnum } from '@/store';
import { pageConfig, setPageConfig, savePage, panel } from '@/hooks';
import { computed, onMounted, ref, defineComponent } from 'vue';
import {
  Board,
  BoardPreview,
  RightPanel,
  ExitDropdown,
  LayerPanel,
  ComponentPanel,
} from '@/components';
import {
  LeftOutlined,
  RightOutlined,
  ScissorOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  PlaySquareOutlined,
  LayoutOutlined,
  UnorderedListOutlined,
  InsertRowRightOutlined,
  FundProjectionScreenOutlined,
  SaveOutlined,
  RestOutlined,
  CameraOutlined,
  SendOutlined,
  DesktopOutlined,
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { getPage } from '@/api';
import { cloneDeep } from 'lodash';

export default defineComponent({
  name: 'editor',
  components: {
    LayerPanel,
    ComponentPanel,
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
    LayoutOutlined,
    UnorderedListOutlined,
    InsertRowRightOutlined,
    FundProjectionScreenOutlined,
    SaveOutlined,
    RestOutlined,
    CameraOutlined,
    SendOutlined,
    DesktopOutlined,
  },
  props: { id: { type: String, default: () => '' } },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const modalOpen = ref(false);

    const icons = [
      { key: 'layer', icon: 'LayoutOutlined' },
      { key: 'component', icon: 'UnorderedListOutlined' },
      { key: 'config', icon: 'FileDoneOutlined' },
      { key: 'util', icon: 'InsertRowRightOutlined' },
    ];
    const panelStatus = computed(() => icons.map(item => ({ ...item, checked: panel[item.key] })));

    const switchPanelShow = (key: string) => {
      panel[key] = !panel[key];
    };

    const buttonGroup = [
      {
        name: '组件删除备份',
        icon: 'RestOutlined',
        event: () => null,
      },
      {
        name: '生成快照',
        icon: 'CameraOutlined',
        event: () => store.dispatch(SnapshotEnum.RECORD_SNAPSHOT),
      },
      {
        name: '保存',
        icon: 'SaveOutlined',
        event: () => savePage(store, router),
      },
      {
        name: '发布',
        icon: 'SendOutlined',
        event: () => {
          modalOpen.value = true;
        },
      },
      {
        name: '预览',
        icon: 'DesktopOutlined',
        event: () => {
          modalOpen.value = true;
        },
      },
    ];

    onMounted(async () => {
      on('contextmenu', e => e.preventDefault());
      if (!props.id) return;
      const res = await getPage<Page>(props.id);
      if (res.code !== 0) return;
      Object.assign(pageConfig, res.data);
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { _id, config, ...remain } = res.data;
      setPageConfig(remain);
      store.dispatch(BoardEnum.SET_BOARD, { data: cloneDeep(config), selected: [] });
    });

    return {
      patchUnit,
      buttonGroup,
      modalOpen,
      pageConfig,
      panelStatus,
      switchPanelShow,
    };
  },
});
</script>

<style lang="less">
.header {
  height: 41px;
  border-bottom: 1px solid var(--border-color-base);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;
  position: relative;
  z-index: 100;
  background-color: var(--component-background);

  img {
    cursor: pointer;
  }

  &__wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__panel-box {
    margin-left: 40px;
  }

  &__button {
    margin-left: 5px;
    width: 40px;
  }

  &__title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;

    span:before {
      margin-left: 5px;
      content: '-';
    }
  }
}

.main {
  height: calc(100% - 41px);
  display: flex;
}

.mid-panel {
  flex: 1;
  height: 100%;
  background-color: var(--item-hover-bg);
  box-sizing: border-box;
  overflow: hidden;

  &__toolbar {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 30px;
    border-bottom: 1px solid var(--border-color-base);
    z-index: 10;
    background-color: var(--component-background);
  }

  &__wrapper {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
}

.canvas-main {
  position: relative;
  height: 100%;
}
</style>

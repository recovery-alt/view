<template>
  <header class="header">
    <img width="40" height="40" src="/src/assets/img/logo.svg" @click="$router.push('/')" />
    <div class="header__wrapper">
      <div class="header__panel-box">
        <Button
          v-for="item in panelStatus"
          :key="item.key"
          class="header__button"
          size="small"
          :type="item.checked ? 'primary' : 'default'"
          @click="panel.switchPanelShow(item.key)"
        >
          <template #icon>
            <component :is="item.icon" />
          </template>
        </Button>
      </div>
      <div class="header__publish">
        <Tooltip v-for="item in buttonGroup" :key="item.name" :title="item.name" placement="bottom">
          <Button v-if="item.label" class="header__button" size="small" @click="item.event?.()">
            {{ item.label }}
          </Button>
          <Button v-else class="header__button" size="small" @click="item.event?.()">
            <template v-if="item.icon" #icon>
              <component :is="item.icon" />
            </template>
          </Button>
        </Tooltip>
      </div>
    </div>

    <div class="header__title">
      <FundProjectionScreenOutlined />
      <span>{{ page.config.title }}</span>
    </div>
  </header>
  <main class="main-container">
    <LayerPanel />
    <ComponentPanel />
    <section class="mid-panel">
      <header class="mid-panel__toolbar"></header>
      <div class="mid-panel__wrapper">
        <section class="canvas-main">
          <Board />
        </section>
      </div>
    </section>
    <RightPanel />
  </main>
  <BoardPreview v-model="modalOpen" />
</template>

<script lang="ts" setup>
import type { Page } from '@/typings';
import type { Component } from 'vue';
import type { PanelKey } from '@/store';
import { on } from '@/utils';
import {
  useSnapshotStore,
  useBoardStore,
  useThemeStore,
  usePageStore,
  usePanelStore,
} from '@/store';
import { computed, createVNode, onBeforeUnmount, onMounted, ref, inject } from 'vue';
import { Board, BoardPreview, RightPanel, LayerPanel, ComponentPanel } from '@/components';
import {
  FileDoneOutlined,
  LayoutOutlined,
  UnorderedListOutlined,
  InsertRowRightOutlined,
  FundProjectionScreenOutlined,
  SaveOutlined,
  RestOutlined,
  CameraOutlined,
  SendOutlined,
  DesktopOutlined,
  SkinOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { getPage } from '@/api';
import cloneDeep from 'lodash/cloneDeep';
import { Modal, Button, Tooltip } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { editor as messages } from '@/locales';

const props = defineProps({ id: { type: String, default: () => '' } });
const snapshot = useSnapshotStore();
const board = useBoardStore();
const page = usePageStore();
const router = useRouter();
const theme = useThemeStore();
const panel = usePanelStore();
const { t } = useI18n({ useScope: 'local', messages });
const { locale } = useI18n({ useScope: 'global' });
const switchLocale = inject<() => void>('switchLocale');

const modalOpen = ref(false);
let letgo = false;

const icons: Array<{ key: PanelKey; icon: Component }> = [
  { key: 'layer', icon: LayoutOutlined },
  { key: 'component', icon: UnorderedListOutlined },
  { key: 'config', icon: FileDoneOutlined },
  { key: 'util', icon: InsertRowRightOutlined },
];
const panelStatus = computed(() => icons.map(item => ({ ...item, checked: panel[item.key] })));

type ButtonItem = {
  name: string;
  icon?: Component;
  label?: string;
  event?: () => void;
};

const buttonGroup = computed<Array<ButtonItem>>(() => [
  {
    name: t('language'),
    label: locale.value as string,
    event: switchLocale,
  },
  {
    name: t('backup'),
    icon: RestOutlined,
    event: () => null,
  },
  {
    name: t('snapshot'),
    icon: CameraOutlined,
    event: () => snapshot.recordSnapshot(),
  },
  {
    name: t('save'),
    icon: SaveOutlined,
    event: () => page.savePage(),
  },
  {
    name: t('publish'),
    icon: SendOutlined,
    event: () => {
      if (props.id) window.open(`/share.html#/pc/${props.id}`);
    },
  },
  {
    name: t('preview'),
    icon: DesktopOutlined,
    event: () => {
      modalOpen.value = true;
    },
  },
  {
    name: t('theme'),
    icon: SkinOutlined,
    event: () => theme.switchTheme(),
  },
]);

const interceptor = (e: BeforeUnloadEvent) => {
  if (page.isModified() && import.meta.env.PROD) e.returnValue = false;
};

onMounted(async () => {
  on('contextmenu', e => e.preventDefault());
  window.addEventListener('beforeunload', interceptor);
  if (!props.id) return;
  const res = await getPage<Page>(props.id);
  if (res.code !== 0) return;
  const { components, ...config } = res.data;
  Object.assign(page.config, config);
  board.setBoard({ data: cloneDeep(components), selected: [] });
  page.updateCache();
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', interceptor);
});

onBeforeRouteLeave((to, from) => {
  const modified = page.isModified();

  if (!letgo && modified) {
    Modal.confirm({
      title: () => t('warning'),
      content: () => t('tip'),
      icon: () => createVNode(ExclamationCircleOutlined),
      onOk() {
        letgo = true;
        router.push(to);
      },
      onCancel() {
        letgo = false;
        router.push(from);
      },
    });

    return false;
  }
});
</script>

<style lang="less">
.header {
  height: 41px;
  border-bottom: 1px solid @border-color-base;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;
  position: relative;
  z-index: 100;
  background-color: @component-background;

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

    span::before {
      margin-left: 5px;
      content: '-';
    }
  }
}

.main-container {
  height: calc(100% - 41px);
  display: flex;
}

.mid-panel {
  flex: 1;
  height: 100%;
  background-color: @layout-body-background;
  box-sizing: border-box;
  overflow: hidden;

  &__toolbar {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 30px;
    border-bottom: 1px solid @border-color-base;
    z-index: 10;
    background-color: @component-background;
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

<template>
  <header class="header">
    <img
      class="cursor-pointer"
      width="40"
      height="40"
      src="/src/assets/img/logo.svg"
      @click="$router.push('/')"
    />
    <div class="flex-1 flex items-center justify-between">
      <div class="ml-40px">
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

    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-16px">
      <FundProjectionScreenOutlined />
      <span class="before:ml-5px before:content--">{{ page.config.title }}</span>
    </div>
  </header>
  <main class="h-[calc(100%-41px)] flex">
    <LayerPanel />
    <ComponentPanel />
    <section class="mid-panel">
      <header class="mid-panel__toolbar"></header>
      <div class="relative h-full overflow-hidden">
        <section class="relative h-full">
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
import { Modal, Button, Tooltip, theme } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { editor as messages } from '@/locales';

const props = defineProps({ id: { type: String, default: () => '' } });
const snapshot = useSnapshotStore();
const board = useBoardStore();
const page = usePageStore();
const router = useRouter();
const themeStore = useThemeStore();
const panel = usePanelStore();
const { t } = useI18n({ useScope: 'local', messages });
const { token } = theme.useToken();
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
    event: () => themeStore.switchTheme(),
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
  border-bottom: 1px solid v-bind('token.colorBorder');
  color: v-bind('token.colorText');
  background-color: v-bind('token.colorBgBase');
  @apply h-41px flex-shrink-0 flex items-center box-border px-20px relative z-100;

  &__button {
    @apply ml-5px w-40px;
  }
}

.mid-panel {
  background-color: v-bind('token.colorBgBase');
  @apply flex-1 h-full box-border overflow-hidden;

  &__toolbar {
    border-bottom: 1px solid v-bind('token.colorBorder');
    background-color: v-bind('token.colorBgBase');
    @apply relative h-40px flex items-center box-border pl-30px z-10;
  }
}
</style>

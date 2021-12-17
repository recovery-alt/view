import { useBoardStore } from '@/store';
import {
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
} from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import { layerPanel as messages } from '@/locales';
import { computed, reactive, ref } from 'vue';
import { judgeCancelGroupDisabled, judgeGroupDisabled } from '@/utils';
import { Data } from '@/typings';

export function useToolBar() {
  const board = useBoardStore();
  const { t } = useI18n({ useScope: 'local', messages });
  const moveActions = [
    {
      tip: t('top'),
      icon: VerticalAlignTopOutlined,
      event: () => board.moveUp(true),
    },
    {
      tip: t('bottom'),
      icon: VerticalAlignBottomOutlined,
      event: () => board.moveDown(true),
    },
    {
      tip: t('up'),
      icon: ArrowUpOutlined,
      event: () => board.moveUp(),
    },
    {
      tip: t('down'),
      icon: ArrowDownOutlined,
      event: () => board.moveDown(),
    },
  ];

  return { moveActions };
}

export function useFooter() {
  const board = useBoardStore();
  const { t } = useI18n({ useScope: 'local', messages });
  const operations = [
    {
      tip: t('group'),
      icon: FolderOutlined,
      event: () => board.group(),
    },
    {
      tip: t('cancelGroup'),
      icon: FolderOpenOutlined,
      event: () => board.cancelGroup(),
    },
    {
      tip: t('lock'),
      icon: LockOutlined,
      event: () => board.toggleLocked(board.selected),
    },
    {
      tip: t('hide'),
      icon: EyeInvisibleOutlined,
      event: () => board.hide(board.selected),
    },
  ];

  const operationActions = computed(() => {
    const result: Array<{ disable?: boolean }> = [];
    result[0] = { disable: judgeGroupDisabled(board) };
    result[1] = { disable: judgeCancelGroupDisabled(board) };
    result[2] = { disable: board.selected.length === 0 };
    result[3] = { disable: board.selected.length === 0 };
    return result;
  });

  return { operations, operationActions };
}

export function useMode() {
  type Mode = 'item' | 'thumbail';
  const mode = ref<Mode>('thumbail');

  const modeList: Array<{ icon: typeof AppstoreOutlined; key: Mode }> = [
    { icon: AppstoreOutlined, key: 'item' },
    { icon: DatabaseOutlined, key: 'thumbail' },
  ];

  function switchMode(current: Mode) {
    mode.value = current;
  }

  return { mode, modeList, switchMode };
}

export function useToggle() {
  const board = useBoardStore();
  const toggleState = reactive<Data<boolean>>({});
  board.data.forEach(item => {
    if (item?.group?.length) toggleState[item.id] = false;
  });

  return { toggleState };
}

export function useReverse() {
  const board = useBoardStore();
  const reverseBoard = computed(() => {
    const data = [...board.data].reverse();
    const selected = board.selected.map(index => data.length - index - 1);

    return { data, selected };
  });
  return { reverseBoard };
}

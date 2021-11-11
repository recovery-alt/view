import type { Data } from '@/typings';
import {
  AppstoreOutlined,
  DatabaseOutlined,
  LeftOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import { computed, reactive, ref, defineComponent, shallowRef } from 'vue';
import { useBoardStore, useMenuStore, usePanelStore, MenuEnum } from '@/store';
import { BoardMenu } from '@/components';
import { judgeCancelGroupDisabled, judgeGroupDisabled } from '@/utils';
import { Tooltip, Empty } from 'ant-design-vue';
import Logo from '@/assets/img/logo.svg';
import classNames from 'classnames';
import './layer-panel.less';
import { useI18n } from 'vue-i18n';
import { layerPanel as messages } from '@/locales';

export default defineComponent({
  name: 'layer-panel',
  setup() {
    const board = useBoardStore();
    const panel = usePanelStore();
    const menu = useMenuStore();
    const showList = ref(false);
    const layerRef = shallowRef<HTMLElement>();
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

    const toggleState = reactive<Data<boolean>>({});
    board.data.forEach(item => {
      if (item?.group?.length) toggleState[item.id] = false;
    });

    const operationActions = computed(() => {
      const result: Array<{ disable?: boolean }> = [];
      result[0] = { disable: judgeGroupDisabled(board) };
      result[1] = { disable: judgeCancelGroupDisabled(board) };
      result[2] = { disable: board.selected.length === 0 };
      result[3] = { disable: board.selected.length === 0 };
      return result;
    });

    const className = computed(() => (showList.value ? '--item' : '--thumbail'));

    function unlock(e: MouseEvent, index: number) {
      e.stopPropagation();
      board.toggleLocked(index);
    }
    function show(e: MouseEvent, index: number) {
      e.stopPropagation();
      board.show(index);
    }

    function changeSelected(e: MouseEvent, index: number) {
      if (e.ctrlKey || e.metaKey) {
        board.changeSelected(index);
      } else {
        board.setIndex(index);
      }
    }

    function switchList(index: number) {
      if ((index === 0 && showList.value) || (index === 1 && !showList.value)) {
        showList.value = !showList.value;
      }
    }

    function toggleGroup(id: string) {
      toggleState[id] = !toggleState[id];
    }

    function handleRightClick(e: MouseEvent, index: number) {
      e.preventDefault();
      if (!board.selected.includes(index)) {
        board.setIndex(index);
      }
      menu.show(e, MenuEnum.LAYER, board);
    }

    function renderToolBarItems() {
      return moveActions.map(item => (
        <Tooltip key={item.icon.name} placement="bottom" title={item.tip}>
          <item.icon
            onClick={item.event}
            class={classNames({ '--disable': board.selected.length === 0 })}
          />
        </Tooltip>
      ));
    }

    function renderItems() {
      return board.data.map((item, index) => {
        const { group, id, locked } = item;
        const { display } = item.style;
        const icon = showList.value ? <DatabaseOutlined /> : <img src={Logo} />;
        let children;
        let parentIcon = icon;

        let LockOrHidden;

        if (locked) {
          LockOrHidden = <LockOutlined class="--icon" onClick={e => unlock(e, index)} />;
        }

        if (display === 'none') {
          LockOrHidden = <EyeInvisibleOutlined class="--icon" onClick={e => show(e, index)} />;
        }

        if (group?.length) {
          const [transform, display] = toggleState[id]
            ? ['rotate(90deg)', 'block']
            : ['rotate(0deg)', 'none'];
          parentIcon = (
            <RightOutlined
              class={'--animated'}
              style={{ transform }}
              onClick={toggleGroup.bind(null, id)}
            />
          );
          children = group.map(val => (
            <li key={val.id} class={classNames('--animated', className.value)} style={{ display }}>
              {icon}
              <b>{val.label}</b>
            </li>
          ));
        }

        return (
          <>
            <li
              key={item.id}
              class={classNames(className.value, {
                '--active': board.selected.includes(index),
              })}
              onContextmenu={e => handleRightClick(e, index)}
              onMouseup={e => changeSelected(e, index)}
            >
              {LockOrHidden}
              {parentIcon}
              <b>{item.label}</b>
            </li>
            {children}
          </>
        );
      });
    }

    function renderFooterTooltip() {
      return operations.map((item, i) => {
        const action = operationActions.value[i];

        return (
          <Tooltip key={item.icon.name} placement="bottom" title={item.tip}>
            <item.icon
              key={item.icon.name}
              onClick={action?.disable ? undefined : item.event}
              class={classNames({ '--disable': action?.disable })}
            />
          </Tooltip>
        );
      });
    }

    return () => (
      <div class={classNames('layer-panel', { '--hide': !panel.layer })} ref={layerRef}>
        <header class="layer-panel__header">
          <div>{t('layer')}</div>
          <section>
            {[AppstoreOutlined, DatabaseOutlined].map((Item, i) => (
              <Item
                key={Item.name}
                class={classNames({ '--active': i === 0 ? !showList.value : showList.value })}
                onClick={switchList.bind(null, i)}
              />
            ))}
            <LeftOutlined onClick={() => panel.switchPanelShow('layer')} />
          </section>
        </header>
        <section class="layer-panel__wrapper">
          <header class="layer-panel__toolbar">{renderToolBarItems()}</header>
          {board.data.length === 0 ? (
            <Empty description={t('tip')} />
          ) : (
            <ul class="layer-panel__box">{renderItems()}</ul>
          )}
          {menu.layer.show && <BoardMenu menu-type={MenuEnum.LAYER} container={layerRef.value} />}
        </section>
        <footer class="layer-panel__footer">{renderFooterTooltip()}</footer>
      </div>
    );
  },
});

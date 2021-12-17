import type { Component, Data } from '@/typings';
import {
  DatabaseOutlined,
  LeftOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import { reactive, defineComponent, shallowRef } from 'vue';
import { useBoardStore, useMenuStore, usePanelStore, MenuEnum } from '@/store';
import { BoardMenu } from '@/components';
import { Empty } from 'ant-design-vue';
import Logo from '@/assets/img/logo.svg';
import classNames from 'classnames';
import './layer-panel.less';
import { useI18n } from 'vue-i18n';
import { layerPanel as messages } from '@/locales';
import { useFooter, useMode, useToolBar } from './hook';

export default defineComponent({
  name: 'layer-panel',
  setup() {
    const board = useBoardStore();
    const panel = usePanelStore();
    const menu = useMenuStore();
    const layerRef = shallowRef<HTMLElement>();
    const { t } = useI18n({ useScope: 'local', messages });
    const { renderToolBarItems } = useToolBar();
    const { renderFooterTooltip } = useFooter();
    const { mode, modeList, switchMode } = useMode();

    const toggleState = reactive<Data<boolean>>({});
    board.data.forEach(item => {
      if (item?.group?.length) toggleState[item.id] = false;
    });

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

    function handleRightClick(e: MouseEvent, index: number) {
      e.preventDefault();
      if (!board.selected.includes(index)) {
        board.setIndex(index);
      }
      menu.show(e, MenuEnum.LAYER, board);
    }

    function renderItem(item: Component, index: number) {
      const { group, id, locked } = item;
      const { display } = item.style;
      const icon = mode.value === 'item' ? <DatabaseOutlined /> : <img src={Logo} />;
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
        const transform = toggleState[id] ? 'rotate(90deg)' : 'rotate(0deg)';
        parentIcon = (
          <RightOutlined
            class={classNames('--animated', {})}
            style={{ transform }}
            onClick={() => (toggleState[id] = !toggleState[id])}
          />
        );
        children = (
          <ul v-show={toggleState[id]}>
            {group.map(val => (
              <li
                key={val.id}
                class={classNames('layer-panel__box-item', '--animated', `--${mode.value}`)}
              >
                {icon}
                <b>{val.label}</b>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <>
          <li
            key={item.id}
            onContextmenu={e => handleRightClick(e, index)}
            onMouseup={e => changeSelected(e, index)}
          >
            <div
              class={classNames('layer-panel__box-item', `--${mode.value}`, {
                '--active': board.selected.includes(index),
              })}
            >
              {LockOrHidden}
              {parentIcon}
              <b>{item.label}</b>
            </div>
            {children}
          </li>
        </>
      );
    }

    return () => (
      <div class={classNames('layer-panel', { '--hide': !panel.layer })} ref={layerRef}>
        <header class="layer-panel__header">
          <div>{t('layer')}</div>
          <section>
            {modeList.map((item, i) => (
              <item.icon
                key={item.key}
                class={classNames({ '--active': item.key === mode.value })}
                onClick={switchMode.bind(null, item.key)}
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
            <ul class="layer-panel__box">{board.data.map(renderItem)}</ul>
          )}
          {menu.layer.show && <BoardMenu menu-type={MenuEnum.LAYER} container={layerRef.value} />}
        </section>
        <footer class="layer-panel__footer">{renderFooterTooltip()}</footer>
      </div>
    );
  },
});

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
import './layer-panel.less';

export default defineComponent({
  name: 'layer-panel',
  setup() {
    const board = useBoardStore();
    const panel = usePanelStore();
    const menu = useMenuStore();

    const showList = ref(false);

    const layerRef = shallowRef<HTMLElement>();

    const unlock = (e: MouseEvent, index: number) => {
      e.stopPropagation();
      board.toggleLocked(index);
    };
    const show = (e: MouseEvent, index: number) => {
      e.stopPropagation();
      board.show(index);
    };

    const moveActions = [
      {
        tip: '置顶',
        icon: VerticalAlignTopOutlined,
        event: () => board.moveUp(true),
      },
      {
        tip: '置底',
        icon: VerticalAlignBottomOutlined,
        event: () => board.moveDown(true),
      },
      {
        tip: '上移',
        icon: ArrowUpOutlined,
        event: () => board.moveUp(),
      },
      {
        tip: '下移',
        icon: ArrowDownOutlined,
        event: () => board.moveDown(),
      },
    ];

    const operations = [
      {
        tip: '成组',
        icon: FolderOutlined,
        event: () => board.group(),
      },
      {
        tip: '取消成组',
        icon: FolderOpenOutlined,
        event: () => board.cancelGroup(),
      },
      {
        tip: '锁定',
        icon: LockOutlined,
        event: () => board.toggleLocked(board.selected),
      },
      {
        tip: '隐藏',
        icon: EyeInvisibleOutlined,
        event: () => board.hide(board.selected),
      },
    ];

    const changeSelected = (e: MouseEvent, index: number) => {
      if (e.ctrlKey || e.metaKey) {
        board.changeSelected(index);
      } else {
        board.setIndex(index);
      }
    };

    const switchList = (index: number) => {
      if ((index === 0 && showList.value) || (index === 1 && !showList.value)) {
        showList.value = !showList.value;
      }
    };

    const toggleState = reactive<Data<boolean>>({});
    board.data.forEach(item => {
      if (item?.group?.length) toggleState[item.id] = false;
    });

    const toggleGroup = (id: string) => {
      toggleState[id] = !toggleState[id];
    };

    const handleRightClick = (e: MouseEvent, index: number) => {
      e.preventDefault();
      if (!board.selected.includes(index)) {
        board.setIndex(index);
      }
      menu.show(e, MenuEnum.LAYER, board);
    };

    const operationActions = computed(() => {
      const result: Array<{ disable?: boolean }> = [];
      result[0] = { disable: judgeGroupDisabled(board) };
      result[1] = { disable: judgeCancelGroupDisabled(board) };
      result[2] = { disable: board.selected.length === 0 };
      result[3] = { disable: board.selected.length === 0 };
      return result;
    });

    const className = computed(() => (showList.value ? '--item' : '--thumbail'));

    return () => (
      <div class={`layer-panel${panel.layer ? '' : ' --hide'}`} ref={layerRef}>
        <header class="layer-panel__header">
          <div>图层</div>
          <section>
            {[AppstoreOutlined, DatabaseOutlined].map((Item, i) => (
              <Item
                key={Item.name}
                class={(i === 0 ? !showList.value : showList.value) && '--active'}
                onClick={switchList.bind(null, i)}
              />
            ))}
            <LeftOutlined
              onClick={() => {
                panel.switchPanelShow('layer');
              }}
            />
          </section>
        </header>
        <section class="layer-panel__wrapper">
          <header class="layer-panel__toolbar">
            {moveActions.map(Item => (
              <Tooltip key={Item.icon.name} placement="bottom" title={Item.tip}>
                <Item.icon
                  onClick={Item.event}
                  class={board.selected.length === 0 && '--disable'}
                />
              </Tooltip>
            ))}
          </header>
          {board.data.length === 0 ? (
            <Empty description="尚未添加任何组件" />
          ) : (
            <ul class="layer-panel__box">
              {board.data.map((item, index) => {
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
                  LockOrHidden = (
                    <EyeInvisibleOutlined class="--icon" onClick={e => show(e, index)} />
                  );
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
                    <li class={`--animated ${className.value}`} style={{ display }}>
                      {icon}
                      <b>{val.label}</b>
                    </li>
                  ));
                }

                return (
                  <>
                    <li
                      class={`${className.value}${
                        board.selected.includes(index) ? ' --active' : ''
                      }`}
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
              })}
            </ul>
          )}
          {menu.layer.show && <BoardMenu menu-type={MenuEnum.LAYER} container={layerRef.value} />}
        </section>
        <footer class="layer-panel__footer">
          {operations.map((Item, i) => {
            const action = operationActions.value[i];

            return (
              <Tooltip key={Item.icon.name} placement="bottom" title={Item.tip}>
                <Item.icon
                  key={Item.icon.name}
                  onClick={action?.disable ? undefined : Item.event}
                  class={action?.disable && '--disable'}
                />
              </Tooltip>
            );
          })}
        </footer>
      </div>
    );
  },
});

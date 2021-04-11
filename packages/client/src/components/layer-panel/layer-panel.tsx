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
import { panel, menu, showMenu } from '@/hooks';
import { computed, reactive, ref, defineComponent, shallowRef } from 'vue';
import { BoardEnum, useStore } from '@/store';
import { BoardMenu } from '@/components';
import { judgeCancelGroupDisabled, judgeGroupDisabled } from '@/utils';
import { Tooltip } from 'ant-design-vue';
import './layer-panel.less';

export default defineComponent({
  name: 'layer-panel',
  setup() {
    const store = useStore();

    const showList = ref(false);

    const { board } = store.state;

    const layerRef = shallowRef<HTMLElement>();

    const unlock = (e: MouseEvent, index: number) => {
      e.stopPropagation();
      store.dispatch(BoardEnum.TOGGLE_LOCKED, index);
    };
    const show = (e: MouseEvent, index: number) => {
      e.stopPropagation();
      store.dispatch(BoardEnum.SHOW, index);
    };

    const moveActions = [
      {
        tip: '置顶',
        icon: VerticalAlignTopOutlined,
        event: () => store.dispatch(BoardEnum.MOVE_UP, true),
      },
      {
        tip: '置底',
        icon: VerticalAlignBottomOutlined,
        event: () => store.dispatch(BoardEnum.MOVE_DOWN, true),
      },
      {
        tip: '上移',
        icon: ArrowUpOutlined,
        event: () => store.dispatch(BoardEnum.MOVE_UP),
      },
      {
        tip: '下移',
        icon: ArrowDownOutlined,
        event: () => store.dispatch(BoardEnum.MOVE_DOWN),
      },
    ];

    const operations = [
      {
        tip: '成组',
        icon: FolderOutlined,
        event: () => store.dispatch(BoardEnum.GROUP),
      },
      {
        tip: '取消成组',
        icon: FolderOpenOutlined,
        event: () => store.dispatch(BoardEnum.CANCEL_GROUP),
      },
      {
        tip: '锁定',
        icon: LockOutlined,
        event: () => store.dispatch(BoardEnum.TOGGLE_LOCKED, board.selected),
      },
      {
        tip: '隐藏',
        icon: EyeInvisibleOutlined,
        event: () => store.dispatch(BoardEnum.HIDE, board.selected),
      },
    ];

    const changeSelected = (e: MouseEvent, index: number) => {
      if (e.ctrlKey || e.metaKey) {
        store.dispatch(BoardEnum.CHANGE_SELECTED, index);
      } else {
        store.dispatch(BoardEnum.SET_INDEX, index);
      }
    };

    const switchList = (index: number) => {
      if ((index === 0 && showList.value) || (index === 1 && !showList.value)) {
        showList.value = !showList.value;
      }
    };

    const toggleState = reactive<Data<boolean>>({});
    board.data.map(item => {
      const { group } = item;

      if (group && group.length > 0) {
        toggleState[item.id] = false;
      }
    });

    const toggleGroup = (id: string) => {
      toggleState[id] = !toggleState[id];
    };

    const handleRightClick = (e: MouseEvent, index: number) => {
      e.preventDefault();
      if (!board.selected.includes(index)) {
        store.dispatch(BoardEnum.SET_INDEX, index);
      }
      showMenu(e, 'layer', board);
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
    const src = '/src/assets/img/logo.svg';

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
                panel.layer = !panel.layer;
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
          <ul class="layer-panel__box">
            {board.data.map((item, index) => {
              const { group, id, locked } = item;
              const { display } = item.style;
              const icon = showList.value ? <DatabaseOutlined /> : <img src={src} />;
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

              if (group && group.length > 0) {
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
                    class={`${className.value}${board.selected.includes(index) ? ' --active' : ''}`}
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
          {menu.layer.show && <BoardMenu menu-type="layer" container={layerRef.value} />}
        </section>
        <footer class="layer-panel__footer">
          {operations.map((Item, i) => {
            const action = operationActions.value[i];

            return (
              <Tooltip key={Item.icon.name} placement="bottom" title={Item.tip}>
                <Item.icon
                  key={Item.icon.name}
                  onClick={action && action.disable ? undefined : Item.event}
                  class={action && action.disable && '--disable'}
                />
              </Tooltip>
            );
          })}
        </footer>
      </div>
    );
  },
});

<script lang="tsx">
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
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import { panel, menu, showMenu } from '@/hooks';
import { computed, reactive, ref } from 'vue';
import { BoardEnum, useStore } from '@/store';
import { BoardMenu } from '@/components';
import { judgeCancelGroupDisabled, judgeGroupDisabled } from '@/utils';

export default {
  name: 'layer-panel',
  components: {
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
    DownOutlined,
    RightOutlined,
    BoardMenu,
  },
  setup() {
    const store = useStore();

    const showList = ref(false);

    const { board } = store.state;

    const layerRef = ref<HTMLElement | null>(null);

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
      showMenu(e, 'layer');
      if (!board.selected.includes(index)) {
        store.dispatch(BoardEnum.SET_INDEX, index);
      }
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
    const src = '//img.alicdn.com/tfs/TB1tVMSk1bviK0jSZFNXXaApXXa-368-208.png';

    return () => (
      <div class="layer-panel" ref={layerRef} class={panel.layer || '--hide'}>
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
              <ATooltip key={Item.icon.name} placement="bottom" title={Item.tip}>
                <Item.icon
                  onClick={Item.event}
                  class={board.selected.length === 0 && '--disable'}
                />
              </ATooltip>
            ))}
          </header>
          <ul class="layer-panel__box">
            {board.data.map((item, index) => {
              const { group, id, locked } = item;
              const { display } = item.style;
              let icon = showList.value ? <DatabaseOutlined /> : <img src={src} />;
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
                  <li class="--animated" class={className.value} style={{ display }}>
                    {icon}
                    <b>{val.label}</b>
                  </li>
                ));
              }

              return (
                <>
                  <li
                    class={className.value}
                    class={board.selected.includes(index) && '--active'}
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
              <ATooltip key={Item.icon.name} placement="bottom" title={Item.tip}>
                <Item.icon
                  key={Item.icon.name}
                  onClick={(action && action.disable) || Item.event}
                  class={action && action.disable && '--disable'}
                />
              </ATooltip>
            );
          })}
        </footer>
      </div>
    );
  },
};
</script>

<style lang="less">
.layer-panel {
  position: relative;
  width: 200px;
  height: 100%;
  border-right: 1px solid var(--border-color-base);
  transition: width 0.3s var(--ease-in-out);
  z-index: 4;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  background-color: var(--component-background);

  .--disable {
    opacity: 0.3;
  }

  &.--hide {
    width: 0;
    border: 0;
  }

  &__header {
    height: 30px;
    background-color: var(--normal-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;

    section {
      display: flex;
    }

    span {
      margin-left: 5px;
      cursor: pointer;
      font-size: 16px;

      &:hover {
        color: var(--primary-8);
      }

      &.--active {
        color: var(--primary-8);
      }
    }
  }

  &__wrapper {
    height: calc(100% - 60px);
  }

  &__toolbar {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 27px;
    border-bottom: 1px solid var(--border-color-base);
    background-color: var(--component-background);

    span {
      padding: 3px;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-8);
        color: var(--component-background);
      }
    }
  }

  &__box {
    li {
      position: relative;
      width: 100%;
      padding-left: 8px;
      padding-right: 6px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-2);
      }

      &.--active {
        color: var(--white);
        background-color: var(--primary-5);
      }
    }

    .--item {
      line-height: 32px;
      height: 32px;
      display: flex;
      align-items: center;

      b {
        margin-left: 5px;
        font-weight: normal;
      }
    }

    .--thumbail {
      height: 48px;
      line-height: 48px;

      img {
        width: 51px;
        height: 34px;
        border: 1px solid var(--border-color-base);
      }

      b {
        margin-left: 5px;
        font-weight: normal;
      }
    }

    .--animated {
      transition: transform 0.3s var(--ease-in-out);
    }

    .--icon {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }

  &__footer {
    height: 30px;
    border-top: 1px solid var(--border-color-base);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 50px;

    span {
      padding: 3px;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-8);
        color: var(--component-background);
      }
    }

    .--icon {
      background-color: var(--primary-color);
      color: var(--white);
    }
  }
}
</style>

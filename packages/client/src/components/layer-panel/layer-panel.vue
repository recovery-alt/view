<script lang="tsx">
import {
  AppstoreOutlined,
  DatabaseOutlined,
  LeftOutlined,
  FolderOutlined,
  DeleteOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import { panel } from '@/hooks';
import { computed, reactive, ref } from 'vue';
import { BoardEnum, useStore } from '@/store';

export default {
  name: 'layer-panel',
  components: {
    AppstoreOutlined,
    DatabaseOutlined,
    LeftOutlined,
    FolderOutlined,
    DeleteOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    DownOutlined,
    RightOutlined,
  },
  setup() {
    const store = useStore();

    const showList = ref(false);

    const { board } = store.state;

    const moveActions = [
      { tip: '置顶', icon: VerticalAlignTopOutlined },
      { tip: '置底', icon: VerticalAlignBottomOutlined },
      { tip: '上移', icon: ArrowUpOutlined },
      { tip: '下移', icon: ArrowDownOutlined },
    ];

    const operations = [
      { tip: '成组', icon: FolderOutlined },
      { tip: '删除', icon: DeleteOutlined },
      { tip: '锁定', icon: LockOutlined },
      { tip: '隐藏', icon: EyeInvisibleOutlined },
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

    const className = computed(() => (showList.value ? '--item' : '--thumbail'));
    const src = '//img.alicdn.com/tfs/TB1tVMSk1bviK0jSZFNXXaApXXa-368-208.png';

    return () => (
      <div class="layer-panel" class={panel.layer || '--hide'}>
        <header class="layer-panel__header">
          <div>图层</div>
          <section>
            {[AppstoreOutlined, DatabaseOutlined].map((Item, i) => (
              <Item
                key={Item.name}
                class={(i === 0 ? !showList.value : showList.value) && 'active'}
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
                <Item.icon />
              </ATooltip>
            ))}
          </header>
          <ul class="layer-panel__box">
            {board.data.map((item, index) => {
              const { group, id } = item;
              let icon = showList.value ? <DatabaseOutlined /> : <img src={src} />;
              let children;
              let parentIcon = icon;

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
                children = group.map((val, i) => (
                  <li class="--animated" class={className.value} style={{ display }}>
                    {icon}
                    <span>{val.label}</span>
                  </li>
                ));
              }

              return (
                <>
                  <li
                    class={className.value}
                    class={board.selected.includes(index) && 'active'}
                    onClick={e => changeSelected(e, index)}
                  >
                    {parentIcon}
                    <span>{item.label}</span>
                  </li>
                  {children}
                </>
              );
            })}
          </ul>
        </section>
        <footer class="layer-panel__footer">
          {operations.map(Item => (
            <ATooltip key={Item.icon.name} placement="bottom" title={Item.tip}>
              <Item.icon key={Item.icon.name} />
            </ATooltip>
          ))}
        </footer>
      </div>
    );
  },
};
</script>

<style lang="less">
.layer-panel {
  width: 200px;
  height: 100%;
  border-right: 1px solid var(--border-color-base);
  transition: width 0.3s var(--ease-in-out);
  z-index: 4;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;

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

      &.active {
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
      width: 100%;
      padding-left: 8px;
      padding-right: 6px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: var(--primary-2);
      }

      &.active {
        color: var(--white);
        background-color: var(--primary-5);
      }
    }

    .--item {
      line-height: 32px;
      height: 32px;
      display: flex;
      align-items: center;

      span {
        margin-left: 5px;
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

      span {
        margin-left: 5px;
      }
    }

    .--animated {
      transition: transform 0.3s var(--ease-in-out);
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
  }
}
</style>

<template>
  <section
    class="component-panel"
    :class="{ 'component-panel--hide': !panel.component }"
    @dragstart="handleDragStart"
  >
    <header class="component-panel__header">
      <div>组件列表</div>
      <LeftOutlined @click="panel.component = !panel.component" />
    </header>
    <div class="component-panel__select-box">
      <InputSearch
        v-show="panel.component"
        enter-button
        placeholder="请输入组件名"
        @search="searchComponent"
      />
    </div>
    <Tabs v-model:activeKey="activeTab" tab-position="left">
      <TabPane v-for="tab in galleryGroup" :key="tab.groupName">
        <template #tab>
          <div class="component-panel__label">
            <component :is="tab.icon" />
            <span>{{ tab.groupName }}</span>
          </div>
        </template>
        <ul class="component-panel__list">
          <li
            v-for="item in tab.list"
            :key="item.type"
            draggable="true"
            class="component-panel__item"
            :data-type="item.type"
          >
            <header>{{ item.name }}</header>
            <img :src="getImgSrc(item.type)" />
          </li>
        </ul>
      </TabPane>
    </Tabs>
  </section>
</template>

<script lang="ts" setup>
import { galleryGroup } from '@/gallery';
import { ref } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import { panel } from '@/hooks';
import DefaultIcon from '@/assets/img/gallery/default.png';
import { InputSearch, Tabs, TabPane } from 'ant-design-vue';

const activeTab = ref('基础');

const handleDragStart = (e: DragEvent) => {
  const target = e.target as HTMLDataListElement;
  if (target.dataset.type) {
    e.dataTransfer?.setData('type', target.dataset.type);
  }
};

const searchComponent = () => {
  // TODO: 查询组件
};

const getImgSrc = (type?: string) => {
  const modules = import.meta.globEager('/src/assets/img/gallery/*.png');
  let Icon;

  for (const key of Object.keys(modules)) {
    const matcher = key.match(/gallery\/(.*)\.png/);
    if (matcher?.[1] && type === matcher[1]) {
      Icon = modules[key].default;
      break;
    }
  }
  return Icon || DefaultIcon;
};
</script>

<style lang="less">
.component-panel {
  width: 233px;
  flex-shrink: 0;
  box-sizing: border-box;
  z-index: 4;
  background-color: @component-background;
  transition: width 0.3s @ease-in-out;
  white-space: nowrap;
  border-right: 1px solid @border-color-base;

  &--hide {
    width: 0;
    border: 0;
  }

  &__header {
    height: 30px;
    background-color: @layout-body-background;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;

    span {
      cursor: pointer;
    }
  }

  &__select-box {
    padding: 5px;
  }

  &__list {
    height: calc(100% - 30px);
    box-sizing: border-box;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 0;
    overflow: auto;
  }

  &__item {
    width: 80px;
    height: 80px;
    margin-bottom: 6px;
    cursor: pointer;

    header {
      height: 22px;
      box-sizing: border-box;
      padding: 0 5px;
      background-color: @layout-body-background;
      text-align: center;
      border-bottom: 1px solid @border-color-base;
    }

    img {
      width: 100%;
      background-color: @background-color-light;
      pointer-events: none;
      height: calc(100% - 22px);
    }
  }

  &__label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      margin-top: 6px;
      font-size: 16px;
    }
  }
}
</style>

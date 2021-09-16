<template>
  <div class="data-panel">
    <div class="timeline-wrapper">
      <Timeline>
        <TimelineItem
          v-for="item in timeline"
          :key="item.text"
          :color="item.actived ? 'blue' : 'gray'"
        >
          <div class="timeline-wrapper__item">
            <span>{{ item.text }}</span>
            <Button v-if="item.btnText" type="primary" size="small" @click="item.event">
              {{ item.btnText }}
            </Button>
            <ReloadOutlined v-else @click="item.event" />
          </div>
        </TimelineItem>
      </Timeline>
    </div>
    <CodeMirror v-model:viewer="viewer" :doc="dataStringify" class="code-box" readonly />
    <Table :data-source="table.data" :columns="table.columns" :pagination="false" />
    <Drawer
      v-if="curComponent.data"
      v-model:visible="drawer.show"
      placement="right"
      title="设置数据源"
      :width="400"
      @close="refreshData"
    >
      <Form label-align="right" :label-col="{ span: 6 }" :wrapper-col="{ span: 17, offset: 1 }">
        <FormItem label="数据源类型">
          <Row justify="space-between">
            <Col>
              <Select v-model:value="curComponent.data.type" size="small">
                <SelectOption v-for="item in drawer.options" :key="item.value" :value="item.value">
                  {{ item.label }}
                </SelectOption>
              </Select>
            </Col>
            <Col offset="2">
              <Button type="primary" size="small" @click="resolveData"> 更新数据 </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="开启过滤器">
          <Row justify="space-between">
            <Col>
              <Switch v-model:checked="drawer.openFilter" @change="handleFilterChange" />
            </Col>
            <Col offset="2">
              <Button type="primary" size="small" @click="modal.show = true">设置过滤器</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem v-if="curComponent.data.type === 'url'" label="接口地址">
          <Input v-model:value="curComponent.data.url" size="small" />
        </FormItem>
        <CodeMirror
          v-if="curComponent.data.type === 'static'"
          v-model:viewer="drawer.viewer"
          :doc="dataStringify"
        />
      </Form>
      <Divider />
      <Table :data-source="table.data" :columns="table.columns" :pagination="false" />
      <Divider orientation="right"> 响应结果 <ReloadOutlined @click="resolveData" /> </Divider>
      <CodeMirror v-model:viewer="drawer.readonlyViewer" :doc="dataStringify" readonly />
    </Drawer>
    <Modal
      v-model:visible="modal.show"
      title="过滤器"
      :z-index="1001"
      @ok="handleFilterChange(true)"
    >
      <CodeMirror v-model:viewer="modal.viewer" :doc="modal.doc" type="javascript" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, ref, shallowRef } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { CodeMirror } from '@/components';
import type { EditorView } from '@codemirror/basic-setup';
import { useDrawer, useModal, useTimeline, useTable } from './hook';
import {
  Timeline,
  TimelineItem,
  Drawer,
  Modal,
  Form,
  FormItem,
  Row,
  Col,
  Select,
  SelectOption,
  Button,
  Switch,
  Divider,
  Table,
  Input,
} from 'ant-design-vue';

const store = useStore();
const { board } = store.state;
const viewer = shallowRef<EditorView>();
const dataStringify = ref<string>();
const curComponent = computed(() => board.data[board.selected[0]]);

const { drawer, refreshData, resolveData } = useDrawer(dataStringify, curComponent);

const { modal, handleFilterChange } = useModal(curComponent, drawer);

const { timeline } = useTimeline(curComponent, drawer, modal);

const { table } = useTable(curComponent);
</script>

<style lang="less">
.data-panel {
  background-color: @component-background;

  &__drawer {
    &-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    &-input {
      flex: 1;
    }
  }

  &__label {
    margin-right: 5px;
  }

  .timeline-wrapper {
    box-sizing: border-box;
    padding: 0 10px;
    padding-top: 10px;

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .code-box {
    margin: 0 10px;
  }
}

.ant-drawer-body .ant-divider-inner-text span:hover {
  color: @primary-color;
}
</style>

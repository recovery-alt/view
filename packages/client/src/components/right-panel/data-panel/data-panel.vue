<template>
  <div class="data-panel">
    <div class="box-border pt-10px px-10px">
      <Timeline>
        <TimelineItem
          v-for="item in timeline"
          :key="item.text"
          :color="item.actived ? 'blue' : 'gray'"
        >
          <div class="flex items-center justify-between">
            <span>{{ item.text }}</span>
            <Button v-if="item.btnText" type="primary" size="small" @click="item.event">
              {{ item.btnText }}
            </Button>
            <ReloadOutlined v-else @click="item.event" />
          </div>
        </TimelineItem>
      </Timeline>
    </div>
    <CodeMirror v-model:viewer="viewer" :doc="dataStringify" class="mx-10px" readonly />
    <Table :data-source="table.data" :columns="table.columns" :pagination="false" />
    <Drawer
      v-if="board.curCom?.data"
      v-model:visible="drawer.show"
      placement="right"
      :title="t('configDataSource')"
      :width="400"
      @close="refreshData"
    >
      <Form label-align="right" :label-col="{ span: 6 }" :wrapper-col="{ span: 17, offset: 1 }">
        <FormItem :label="t('dataSourceType')">
          <Row justify="space-between">
            <Col>
              <Select v-model:value="board.curCom!.data.type" size="small">
                <SelectOption v-for="item in drawer.options" :key="item.value" :value="item.value">
                  {{ item.label }}
                </SelectOption>
              </Select>
            </Col>
            <Col offset="2">
              <Button type="primary" size="small" @click="resolveData()">
                {{ t('updateData') }}
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="t('openFilter')">
          <Row justify="space-between">
            <Col>
              <Switch v-model:checked="drawer.openFilter" @change="handleFilterChange" />
            </Col>
            <Col offset="2">
              <Button type="primary" size="small" @click="modal.show = true">
                {{ t('configFilter') }}
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem v-if="board.curCom?.data.type === 'url'" :label="t('url')">
          <Input v-model:value="board.curCom!.data.url" size="small" />
        </FormItem>
        <CodeMirror
          v-if="board.curCom?.data.type === 'static'"
          v-model:viewer="drawer.viewer"
          :doc="dataStringify"
        />
      </Form>
      <Divider />
      <Table :data-source="table.data" :columns="table.columns" :pagination="false" />
      <Divider orientation="right">
        {{ t('response') }} <ReloadOutlined @click="resolveData()" />
      </Divider>
      <CodeMirror v-model:viewer="drawer.readonlyViewer" :doc="dataStringify" readonly />
    </Drawer>
    <Modal
      v-model:visible="modal.show"
      :title="t('filter')"
      :z-index="1001"
      @ok="handleFilterChange(true)"
    >
      <CodeMirror v-model:viewer="modal.viewer" :doc="modal.doc" type="javascript" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { useBoardStore } from '@/store';
import { ref, shallowRef } from 'vue';
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
  theme,
} from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { dataPanel as messages } from '@/locales';

const board = useBoardStore();
const viewer = shallowRef<EditorView>();
const dataStringify = ref<string>();
const { t } = useI18n({ useScope: 'local', messages });

const { drawer, refreshData, resolveData } = useDrawer(dataStringify);

const { modal, handleFilterChange } = useModal(drawer);

const { timeline } = useTimeline(drawer, modal);

const { table } = useTable();

const { token } = theme.useToken();
</script>

<style lang="less">
.data-panel {
  background-color: v-bind('token.colorBgBase');
}
</style>

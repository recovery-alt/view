<template>
  <Table bordered size="small" :data-source="pages" :columns="columns" row-key="_id">
    <template #width="{ text }"> {{ text }}px </template>
    <template #height="{ text }"> {{ text }}px </template>
    <template #action="{ record }">
      <a @click="toEdit(record._id)">{{ t('view') }}</a>
      <Divider type="vertical" />
      <a @click="handleDelete(record._id)">{{ t('delete') }}</a>
    </template>
  </Table>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useManage } from '@/hooks';
import { generateColumns } from '@/utils';
import { deletePage } from '@/api';
import { message, Divider, Table } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { ref, watchEffect } from 'vue';
import { page as messages } from '@/locales';

const { pages, getAllPage } = useManage();
const router = useRouter();
const { t } = useI18n({ useScope: 'local', messages });
const { locale } = useI18n({ useScope: 'global' });

const columns = ref<ReturnType<typeof getColumns>>([]);

function getColumns() {
  return generateColumns([
    {
      title: t('author'),
      key: 'author',
    },
    {
      title: t('description'),
      key: 'description',
    },
    {
      title: t('title'),
      key: 'title',
    },
    {
      title: t('pageMode'),
      key: 'pageMode',
    },
    {
      title: t('width'),
      key: 'width',
    },
    {
      title: t('height'),
      key: 'height',
    },
    {
      title: t('action'),
      key: 'action',
    },
  ]);
}

function toEdit(id: string) {
  router.push({ path: `/editor/${id}`, params: { id } });
}

async function handleDelete(id: string) {
  const res = await deletePage(id);
  if (res.code === 0) {
    message.success('删除成功。');
    getAllPage();
  } else {
    message.error('删除失败，请稍后重试～');
  }
}

watchEffect(() => {
  if (locale.value) columns.value = getColumns();
});
</script>

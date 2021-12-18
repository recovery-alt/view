<template>
  <div class="header-right">
    <Button size="small" @click="switchLocale?.()">{{ locale }}</Button>
    <SkinOutlined class="theme-change" @click="theme.switchTheme()" />
    <Dropdown>
      <div class="exit-dropdown">
        <Avatar>
          <template #icon>
            <UserOutlined />
          </template>
        </Avatar>
        <span class="header-right_span">{{ userInfo.name }}</span>
      </div>
      <template #overlay>
        <Menu>
          <MenuItem key="0" @click="visible = true">{{ t('dialog.modify') }}</MenuItem>
          <MenuItem v-if="$route.path.includes('editor')" key="1" @click="$router.push('/')">
            {{ t('back') }}
          </MenuItem>
          <MenuItem key="2" @click="logout">{{ t('exit') }}</MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
  <Modal
    v-model:visible="visible"
    :title="t('dialog.modify')"
    :after-close="resetFields"
    @ok="submitPasswordChange"
  >
    <Form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
      <FormItem :label="t('dialog.old')" v-bind="validateInfos.password">
        <Input v-model:value="form.password" type="password" />
      </FormItem>
      <FormItem :label="t('dialog.new')" v-bind="validateInfos.newPassword">
        <Input v-model:value="form.newPassword" type="password" />
      </FormItem>
      <FormItem :label="t('dialog.confirm')" v-bind="validateInfos.confirmPassword">
        <Input v-model:value="form.confirmPassword" type="password" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script lang="ts" setup>
import type { RuleType } from 'ant-design-vue/lib/form/interface';
import { UserOutlined, SkinOutlined } from '@ant-design/icons-vue';
import { local, to, encrypt } from '@/utils';
import { LocalKeys } from '@/enum';
import { useRouter, useRoute } from 'vue-router';
import { reactive, ref, inject } from 'vue';
import { changePassword } from '@/api';
import json from 'json5';
import {
  message,
  Dropdown,
  Avatar,
  Menu,
  MenuItem,
  Modal,
  Form,
  FormItem,
  Input,
  Button,
} from 'ant-design-vue';
import { useThemeStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { exitDropdown as messages } from '@/locales';

const userInfoStr = local.get(LocalKeys.USER_INFO);
const userInfo = userInfoStr ? json.parse(userInfoStr) : {};
const router = useRouter();
const route = useRoute();
const theme = useThemeStore();
const { locale } = useI18n({ useScope: 'global' });
const { t } = useI18n({ useScope: 'local', messages });
const visible = ref(false);
const switchLocale = inject<() => void>('switchLocale');

const form = reactive({
  password: '',
  newPassword: '',
  confirmPassword: '',
});

const checkPassword = async (rule: RuleType, value: string) => {
  if (!value) {
    return Promise.reject(t('validator.empty'));
  }

  if (!/^[a-zA-Z]\w{5,17}$/.test(value)) {
    return Promise.reject(t('validator.length'));
  }

  return Promise.resolve();
};

const checkPasswordSync = async (rule: RuleType, value: string) => {
  const [err] = await to(checkPassword(rule, value));
  if (err) {
    return Promise.reject(err);
  }

  if (value !== form.newPassword) {
    return Promise.reject(t('validator.consistent'));
  }

  return Promise.resolve();
};

const rules = reactive({
  password: [{ required: true, validator: checkPassword, trigger: 'blur' }],
  newPassword: [{ required: true, validator: checkPassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: checkPasswordSync, trigger: 'blur' }],
});

const { resetFields, validate, validateInfos } = Form.useForm(form, rules);

const submitPasswordChange = async () => {
  const [err] = await to(validate());
  if (err) return;
  const password = encrypt(form.password);
  const newPassword = encrypt(form.newPassword);
  const res = await changePassword({ password, newPassword });
  if (res.code === 0) {
    visible.value = false;
    message.success(t('message.success.edit'));
  } else {
    message.error(res.msg);
  }
};

const logout = () => {
  local.remove(LocalKeys.AUTHORIZATION);
  router.push(`/login?redirect=${route.path}`);
  message.success(t('message.success.logout'));
};
</script>

<style lang="less">
.exit-dropdown {
  padding: 0 8px;
  font-size: 16px;
  color: @text-color;
  cursor: pointer;
  margin-left: 20px;

  &:hover {
    background-color: @item-hover-bg;
  }
}

.header-right {
  display: flex;
  justify-content: center;
  align-items: center;
  color: @text-color;

  &_span {
    margin-left: 5px;
  }
}

.theme-change {
  margin-left: 10px;
  &:hover {
    color: @primary-color;
  }
}
</style>

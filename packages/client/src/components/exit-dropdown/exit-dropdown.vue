<template>
  <div class="header-right">
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
          <MenuItem key="0" @click="visible = true">修改密码</MenuItem>
          <MenuItem v-if="$route.path.includes('editor')" key="1" @click="$router.push('/')">
            返回管理页
          </MenuItem>
          <MenuItem key="2" @click="logout">退出</MenuItem>
        </Menu>
      </template>
    </Dropdown>
    <SkinOutlined class="theme-change" @click="theme.switchTheme()" />
  </div>
  <Modal
    v-model:visible="visible"
    title="修改密码"
    :after-close="resetFields"
    @ok="submitPasswordChange"
  >
    <Form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
      <FormItem label="原密码" v-bind="validateInfos.password">
        <Input v-model:value="form.password" type="password" />
      </FormItem>
      <FormItem label="新密码" v-bind="validateInfos.newPassword">
        <Input v-model:value="form.newPassword" type="password" />
      </FormItem>
      <FormItem label="确认密码" v-bind="validateInfos.confirmPassword">
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
import { reactive, ref } from 'vue';
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
} from 'ant-design-vue';
import { useThemeStore } from '@/store';

const userInfoStr = local.get(LocalKeys.USER_INFO);
const userInfo = userInfoStr ? json.parse(userInfoStr) : {};
const router = useRouter();
const route = useRoute();
const theme = useThemeStore();

const visible = ref(false);

const form = reactive({
  password: '',
  newPassword: '',
  confirmPassword: '',
});

const checkPassword = async (rule: RuleType, value: string) => {
  if (/S+/.test(value)) {
    return Promise.reject('密码不能为空。');
  }

  if (!/^[a-zA-Z]\w{5,17}$/.test(value)) {
    return Promise.reject('密码需以字母开头，长度在6~18之间。');
  }

  return Promise.resolve();
};

const checkPasswordSync = async (rule: RuleType, value: string) => {
  const [err] = await to(checkPassword(rule, value));
  if (err) {
    return Promise.reject(err);
  }

  if (value !== form.newPassword) {
    return Promise.reject('两次输入不一致。');
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
    message.success('修改成功！');
  } else {
    message.error(res.msg);
  }
};

const logout = () => {
  local.remove(LocalKeys.AUTHORIZATION);
  router.push(`/login?redirect=${route.path}`);
  message.success('已退出登录！');
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

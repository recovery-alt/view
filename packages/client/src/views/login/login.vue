<template>
  <div class="login">
    <div class="login-box">
      <span>用户登录</span>
      <Form
        hide-required-mark
        label-align="left"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        :model="form"
      >
        <FormItem name="name" label="用户名" :rules="rules.name">
          <Input v-model:value="form.name" placeholder="用户名" />
        </FormItem>
        <FormItem name="password" label="密码" :rules="rules.password">
          <Input v-model:value="form.password" placeholder="密码" />
        </FormItem>
        <FormItem :wrapper-col="{ span: 8, offset: 8 }">
          <Button type="primary" @click="submitLogin">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserInfo } from '@/typings';
import { reactive } from 'vue';
import { login } from '@/api';
import { message, Form, FormItem, Button, Input } from 'ant-design-vue';
import { encrypt, to } from '@/utils';
import { useRouter } from 'vue-router';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';

const props = defineProps({ redirect: { type: String, default: () => '' } });

const form = reactive({ name: 'ccq', password: 'a123456' });
const rules = reactive({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});
const router = useRouter();
const { validate } = Form.useForm(form, rules);

const submitLogin = async () => {
  const [err] = await to(validate());
  if (err) return;

  const { name, password } = form;
  const res = await login<UserInfo>({ name, password: encrypt(password) });
  if (res.code === 0) {
    const { token, name } = res.data;
    local.set(LocalKeys.AUTHORIZATION, token);
    local.set(LocalKeys.USER_INFO, { name });
    message.success('登录成功！');
    router.push(props.redirect || '/');
  } else {
    message.error('登录失败！');
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: @layout-body-background;
  display: flex;
  align-items: center;
  justify-content: center;

  &-box {
    box-sizing: border-box;
    padding: 20px;
    background-color: @component-background;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 3px;

    span {
      margin-bottom: 20px;
    }
  }
}
</style>

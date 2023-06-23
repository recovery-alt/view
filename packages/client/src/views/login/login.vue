<template>
  <div class="login">
    <div class="login-box">
      <span class="ml-20px">{{ t('user.login') }}</span>
      <Form
        hide-required-mark
        label-align="left"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        :model="form"
      >
        <FormItem name="name" :label="t('user.name')" :rules="rules.name">
          <Input v-model:value="form.name" :placeholder="t('user.name')" />
        </FormItem>
        <FormItem name="password" :label="t('user.password')" :rules="rules.password">
          <Input v-model:value="form.password" :placeholder="t('user.password')" />
        </FormItem>
        <FormItem :wrapper-col="{ span: 8, offset: 8 }">
          <Button type="primary" @click="submitLogin">{{ t('login') }}</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Data, UserInfo } from '@/typings';
import type { RuleObject } from 'ant-design-vue/es/form/interface';
import { reactive } from 'vue';
import { login } from '@/api';
import { message, Form, FormItem, Button, Input, theme } from 'ant-design-vue';
import { encrypt, to } from '@/utils';
import { useRouter } from 'vue-router';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import { useI18n } from 'vue-i18n';
import { login as messages } from '@/locales';

const props = defineProps({ redirect: { type: String, default: () => '' } });
const { t } = useI18n({ useScope: 'local', messages });
const { token } = theme.useToken();

const form = reactive({ name: 'ccq', password: 'a123456' });
const rules = reactive<Data<RuleObject[]>>({
  name: [{ required: true, message: t('validator.username'), trigger: 'blur' }],
  password: [{ required: true, message: t('validator.password'), trigger: 'blur' }],
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
    message.success(t('notify.success'));
    router.push(props.redirect || '/');
  } else {
    message.error(t('notify.fail'));
  }
};
</script>

<style lang="less" scoped>
.login {
  background-color: v-bind('token.colorBgBase');
  @apply h-full flex items-center justify-center;

  &-box {
    background-color: v-bind('token.colorBgBase');
    @apply box-border p-20px flex flex-col items-center justify-center rounded-3px;
  }
}
</style>

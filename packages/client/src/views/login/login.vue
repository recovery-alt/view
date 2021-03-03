<template>
  <div class="login">
    <div class="login-box">
      <span>用户登录</span>
      <a-form
        hide-required-mark
        label-align="left"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        :model="form"
      >
        <a-form-item name="name" label="用户名" :rules="rules.name">
          <a-input v-model:value="form.name" placeholder="用户名" />
        </a-form-item>
        <a-form-item name="password" label="密码" :rules="rules.password">
          <a-input v-model:value="form.password" placeholder="密码" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 8, offset: 8 }">
          <a-button type="primary" @click="submitLogin">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { login } from '@/api';
import { message } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import { encrypt } from '@/utils';
import { useRouter } from 'vue-router';
import { local } from '@/utils';

export default {
  name: 'login',
  setup() {
    const form = reactive({ name: 'ccq', password: '123456' });
    const rules = reactive({
      name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    });
    const router = useRouter();
    const { resetFields, validate, validateField } = useForm(form, rules);

    const submitLogin = () => {
      validate().then(async () => {
        const { name, password } = form;
        const res = await login<string>({ name, password: encrypt(password) });
        if (res.code === 0) {
          local.set('authorization', res.data);
          message.success('登录成功！');
          router.push('/');
        } else {
          message.error('登录失败！');
        }
      });
    };

    return { form, rules, submitLogin };
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;

  &-box {
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
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

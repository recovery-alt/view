<template>
  <div class="login">
    <div class="login-box">
      <span>用户登录</span>
      <el-form ref="formRef" label-width="80px" hide-required-asterisk :model="form">
        <el-form-item
          prop="name"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" @click="submitLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { login } from '@/api';
import { ElMessage } from 'element-plus';
import { encrypt } from '@/utils';
import { useRouter } from 'vue-router';
import { local } from '@/utils';

export default {
  name: 'login',
  setup() {
    const form = reactive({ name: 'ccq', password: '123456' });
    const formRef = ref<any>(null);
    const router = useRouter();

    const submitLogin = () => {
      if (!formRef.value) return;
      formRef.value.validate(async valid => {
        if (valid) {
          const { name, password } = form;
          const res = await login<string>({ name, password: encrypt(password) });
          if (res.code === 0) {
            local.set('authorization', res.data);
            ElMessage.success('登录成功！');
            router.push('/');
          } else {
            ElMessage.error('登录失败！');
          }
        }
      });
    };

    return { form, formRef, submitLogin };
  },
};
</script>

<style lang="scss" scoped>
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

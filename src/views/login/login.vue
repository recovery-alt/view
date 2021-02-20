<template>
  <div class="login">
    <div class="login-box">
      <el-form ref="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="name" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'login',
  setup() {
    const name = ref('');
    const password = ref('');
    return { name, password };
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
    width: 480px;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
  }
}
</style>

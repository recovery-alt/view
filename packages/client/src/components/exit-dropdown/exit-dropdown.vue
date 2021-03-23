<template>
  <div class="header-right">
    <a-dropdown>
      <div class="exit-dropdown">
        <a-avatar>
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <span class="header-right_span">{{ userInfo.name }}</span>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item key="0" @click="visible = true">修改密码</a-menu-item>
          <a-menu-item v-if="$route.path.includes('editor')" key="1" @click="$router.push('/')">
            返回管理页
          </a-menu-item>
          <a-menu-item key="2" @click="logout">退出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-dropdown>
      <BgColorsOutlined class="theme-change" />
      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="(item, index) in ['明亮主题', '暗黑主题']"
            :key="item"
            @click="changeTheme(index)"
          >
            {{ item }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
  <a-modal
    v-model:visible="visible"
    title="修改密码"
    :after-close="resetFields"
    @ok="submitPasswordChange"
  >
    <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="原密码" v-bind="validateInfos.password">
        <a-input v-model:value="form.password" type="password" />
      </a-form-item>
      <a-form-item label="新密码" v-bind="validateInfos.newPassword">
        <a-input v-model:value="form.newPassword" type="password" />
      </a-form-item>
      <a-form-item label="确认密码" v-bind="validateInfos.confirmPassword">
        <a-input v-model:value="form.confirmPassword" type="password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { UserOutlined, BgColorsOutlined } from '@ant-design/icons-vue';
import { local, to, encrypt } from '@/utils';
import { LocalKeys } from '@/enum';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { changePassword } from '@/api';
import { RuleType } from 'ant-design-vue/lib/form/interface';

export default {
  name: 'exit-dropdown',
  components: { UserOutlined, BgColorsOutlined },
  setup() {
    const userInfoStr = local.get(LocalKeys.USER_INFO);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
    const router = useRouter();
    const route = useRoute();

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

    const { resetFields, validate, validateInfos } = useForm(form, rules);

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

    const changeTheme = (dark: number) => {
      document.documentElement.setAttribute('theme', dark ? 'dark' : 'light');
    };

    const logout = () => {
      local.remove(LocalKeys.AUTHORIZATION);
      router.push(`/login?redirect=${route.path}`);
      message.success('已退出登录！');
    };

    return {
      userInfo,
      logout,
      visible,
      form,
      resetFields,
      validateInfos,
      validate,
      submitPasswordChange,
      changeTheme,
    };
  },
};
</script>

<style lang="less">
.exit-dropdown {
  padding: 0 8px;
  font-size: 16px;
  color: var(--text-color);
  cursor: pointer;
  margin-left: 20px;

  &:hover {
    background-color: var(--item-hover-bg);
  }
}

.header-right {
  display: flex;
  justify-content: center;
  align-items: center;

  &_span {
    margin-left: 5px;
  }
}

.theme-change {
  margin-left: 10px;
  &:hover {
    color: var(--primary-7);
  }
}
</style>

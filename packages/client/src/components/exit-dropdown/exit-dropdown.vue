<template>
  <div class="header-right">
    <a-dropdown>
      <div class="exit-dropdown">
        <a-avatar>
          <template #icon>
            <user-outlined />
          </template>
        </a-avatar>
        <span class="header-right_span">{{ userInfo.name }}</span>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item key="0">修改密码</a-menu-item>
          <a-menu-item key="1" @click="logout">退出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-dropdown>
      <bg-colors-outlined class="theme-change" />
      <template #overlay>
        <a-menu>
          <a-menu-item key="0">明亮主题</a-menu-item>
          <a-menu-item key="1">暗黑主题</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { UserOutlined, BgColorsOutlined } from '@ant-design/icons-vue';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';

export default {
  name: 'exit-dropdown',
  components: { UserOutlined, BgColorsOutlined },
  setup() {
    const userInfoStr = local.get(LocalKeys.USER_INFO);
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
    const router = useRouter();
    const route = useRoute();

    const logout = () => {
      local.remove(LocalKeys.AUTHORIZATION);
      router.push(`/login?redirect=${route.path}`);
      message.success('已退出登录！');
    };

    return { userInfo, logout };
  },
};
</script>

<style lang="less" scoped>
.exit-dropdown {
  padding: 0 8px;
  font-size: 16px;
  color: #000000d9;
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

  &_span {
    margin-left: 5px;
  }
}

.theme-change {
  margin-left: 10px;
  &:hover {
    color: @primary-7;
  }
}
</style>

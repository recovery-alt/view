import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
import type { Component } from 'vue';

export const routeMap: Data<{ icon: Component; name: string }> = {
  page: { icon: UserOutlined, name: '页面管理' },
  masterplate: { icon: VideoCameraOutlined, name: '模板管理' },
};

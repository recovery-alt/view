import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
import type { Component } from 'vue';

export const routeList: Array<{ key: string; icon: Component; name: string }> = [
  { key: 'page', icon: UserOutlined, name: '页面管理' },
  { key: 'masterplate', icon: VideoCameraOutlined, name: '模板管理' },
];

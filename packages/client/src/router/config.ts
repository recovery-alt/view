import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
import type { Component } from 'vue';

export const routeList: Array<{ key: string; icon: Component }> = [
  { key: 'page', icon: UserOutlined },
  { key: 'masterplate', icon: VideoCameraOutlined },
];

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    props: route => ({ redirect: route.query.redirect }),
    component: () => import('@/views/login'),
  },
  {
    path: '/',
    name: 'manage',
    meta: { requiresAuth: true },
    component: () => import('@/views/manage'),
  },
  {
    path: '/editor/:id?',
    name: 'editor',
    props: true,
    meta: { requiresAuth: true },
    component: () => import('@/views/editor'),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach(to => {
  if (to.meta.requiresAuth && !local.get(LocalKeys.AUTHORIZATION)) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    };
  }
});

export default router;

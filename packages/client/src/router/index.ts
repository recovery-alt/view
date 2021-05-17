import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { local } from '@/utils';
import { LocalKeys } from '@/enum';
import { NotFound } from '@/views/error';

const modules = import.meta.glob('../views/manage/*.vue');

const children: RouteRecordRaw[] = [];

for (const [key, module] of Object.entries(modules)) {
  const matcher = key.match(/manage\/(.*).vue/);
  if (matcher?.[1]) {
    children.push({
      path: matcher[1],
      name: matcher[1],
      component: module,
    });
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/manage',
  },
  {
    path: '/login',
    name: 'login',
    props: route => ({ redirect: route.query.redirect }),
    component: () => import('@/views/login'),
  },
  {
    path: '/editor/:id?',
    name: 'editor',
    props: true,
    meta: { requiresAuth: true },
    component: () => import('@/views/editor'),
  },
  {
    path: '/manage',
    name: 'manage',
    meta: { requiresAuth: true },
    redirect: '/manage/page',
    component: () => import('@/views/layout/'),
    children,
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound,
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

export * from './config';

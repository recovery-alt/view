import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
  },
  {
    path: '/',
    name: 'manage',
    component: () => import('@/views/manage'),
  },
  {
    path: '/editor/:id?',
    name: 'editor',
    props: true,
    component: () => import('@/views/editor'),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;

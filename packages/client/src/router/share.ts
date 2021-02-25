import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/pc/:id?',
    name: 'pc',
    props: true,
    component: () => import('@/share/engine-pc.vue'),
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(import.meta.env.BASE_URL),
});

export default router;

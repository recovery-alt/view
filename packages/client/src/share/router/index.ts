import {
  createRouter as _createRouter,
  createWebHashHistory,
  createMemoryHistory,
  RouteRecordRaw,
} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/pc/:id?',
    name: 'pc',
    props: true,
    component: () => import('../components/engine-pc.vue'),
  },
];

export function createRouter() {
  return _createRouter({
    routes,
    history: import.meta.env.SSR
      ? createMemoryHistory()
      : createWebHashHistory(import.meta.env.BASE_URL),
  });
}

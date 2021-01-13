import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
});

export default router;

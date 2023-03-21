import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Vue3ElTable from '../components/Vue3ElTable/index.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../pages/login/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/home/index.vue'),
  },
  {
    path: '/table',
    name: 'Vue3ElTable',
    component: Vue3ElTable,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

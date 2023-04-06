import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Vue3ElTable from '../components/Vue3ElTable/index.vue';
import login from '../views/login/index.vue';
import home from '../views/home/index.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: login,
  },
  {
    path: '/home',
    name: 'Home',
    component: home,
    children: [
      {
        path: '/home/table',
        meta: {
          title: '表格',
        },
        name: 'Vue3ElTable',
        component: Vue3ElTable,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home/index.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", name: 'Home', component: Home },
  { path: "/login", name: 'Login', component: Login },
  { path: '/user', name: 'User', component: () => import('../views/user/index.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

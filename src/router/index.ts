import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home/index.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/Login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

import Project from '@/views/Project.vue'
import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/proj',
      name: 'project',
      component: Project,
    },
  ],
})

export default router

import Project from '@/views/Project.vue'
import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import MCreateProject from '@/components/module/MCreateProject.vue'

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
      path: '/proj/:proj_id',
      name: 'project',
      component: Project,
    },
    {
      path: '/proj/new',
      name: 'createProject',
      component: MCreateProject,
    },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import ProjectView from '@/views/ProjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/proj/:proj_id',
      name: 'project',
      component: ProjectListView,
    },
    {
      path: '/proj/test',
      name: 'test_proj',
      component: ProjectView,
    },
    // {
    //   path: '/proj/new',
    //   name: 'createProject',
    //   component: MCreateProject,
    // },
    // {
    //   path: '/proj',
    //   name: 'user_proj_list',
    //   component: MListProject,
    // },
  ],
})

export default router

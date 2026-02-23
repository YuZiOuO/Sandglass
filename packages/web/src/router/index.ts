import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Workbench',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/project',
      name: 'ProjectList',
      component: () => import('@/views/ProjectListView.vue'),
    },
    {
      path: '/attandance',
      name: 'attandance',
      component: () => import('@/views/attendance/AttendanceView.vue'),
    },
    {
      path: '/project/:id',
      name: 'Project',
      component: () => import('@/views/project/ProjectView.vue'),
    },
  ],
})

export default router

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
    // {
    //   path: '/preview',
    //   name: 'preview',
    //   component: PreviewView,
    // },
    {
      path: '/attandance',
      name: 'attandance',
      component: () => import('@/views/attandance/AttendanceView.vue'),
    },
    {
      path: '/project/:id',
      name: 'Project',
      component: () => import('@/views/project/ProjectView.vue'),
    },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { authCli, notifyError } from '@/services-composable/common'

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
      path: '/attendance',
      name: 'attendance',
      component: () => import('@/views/attendance/AttendanceView.vue'),
    },
    {
      path: '/project/:id',
      name: 'Project',
      component: () => import('@/views/project/ProjectView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/ErrorView.vue'),
    },
  ],
})

// auth guard
router.beforeEach(async (to, from, next) => {
  const session = authCli.useSession()
  const isLoggedIn = !!session.value.data?.user

  const whiteList = ['/', '/login']

  if (isLoggedIn || whiteList.includes(to.path)) {
    next()
  } else {
    const err = new Error('您尚未登录')
    err.name = '路径不合法'
    notifyError(err)
    next('/login')
  }
})

export default router

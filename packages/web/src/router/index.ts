import { createRouter, createWebHistory } from 'vue-router'
import { notifyError } from '@/error'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { useOptimisticAuthStatus } from '@/services-composable/common'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/login/success',
      name: 'OAuthSuccess',
      component: () => import('@/views/OAuthSuccessView.vue'),
    },
    {
      path: '/project',
      name: 'ProjectList',
      component: () => import('@/views/project-list/ProjectListView.vue'),
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
router.beforeEach(async (to, _from, next) => {
  const isLoggedIn = useOptimisticAuthStatus()

  const loginPath = '/login'
  const whiteList = ['/', '/login/success', loginPath]

  const err = new Error()
  err.name = '路径不合法'

  if (!isLoggedIn.value) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      err.message = '您尚未登录'
      notifyError(err)
      next('/login')
    }
  } else {
    if (to.path === loginPath) {
      err.message = '无效操作: 请先注销'
      notifyError(err)
    } else {
      next()
    }
  }
})

export default router

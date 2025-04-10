import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import ProjectView from '@/views/ProjectView.vue'
import { loadingBar } from '@/api/ui_api'

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
      path: '/proj',
      name: 'Project',
      children: [
        {
          path: ':proj_id',
          name: 'Project#',
          component: ProjectView,
          props: true,
        },
        {
          path: '',
          name: 'ProjectList',
          component: ProjectListView,
        },
      ],
    },
    // {
    //   path: '/proj/new',
    //   name: 'createProject',
    //   component: MCreateProject,
    // },
  ],
})

router.beforeEach(() => {
  loadingBar.start()
  return true
})

router.afterEach(() => {
  loadingBar.finish()
  return true
})

export default router

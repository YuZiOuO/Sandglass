// router.beforeEach(async (to, from) => {
//   if (
//     // 检查用户是否已登录
//     !isAuthenticated &&
//     // ❗️ 避免无限重定向
//     to.name !== 'Login'
//   ) {
//     // 将用户重定向到登录页面
//     return { name: 'Login' }
//   }
// })

import { useRouter } from 'vue-router'

// router.afterEach((to, from) => {
//   sendToAnalytics(to.fullPath)
// })
const router = useRouter()

// router.beforeResolve(async (to) => {
//   if (to.meta.requiresCamera) {
//     try {
//       await askForCameraPermission()
//     } catch (error) {
//       if (error instanceof NotAllowedError) {
//         // ... 处理错误，然后取消导航
//         return false
//       } else {
//         // 意料之外的错误，取消导航并把错误传给全局处理器
//         throw error
//       }
//     }
//   }
// })

import { apiEncode } from './api'
import type { UserAuth } from './model/user'

export async function login(authInfo: UserAuth) {
  return apiEncode().get('/token', {
    params: authInfo,
  })
}

// export async function logout() {
//   return request<void>('DELETE', '/token')
// }

// export async function signup(user: User) {
//   return request<string>('POST', '/user', { email: user.email, pwd: user.pwd })
// }

import { encodeURIParams, request } from '@/api/util.ts'
import type { User, UserAuth } from '@/api/model/user_model.ts'

export async function login(authInfo: UserAuth) {
  // FIXME: 不安全的类型转换
  const url = `/token?${encodeURIParams(authInfo as unknown as Record<string, string>)}`
  return request<string>('GET', url)
}

export async function logout() {
  return request<void>('DELETE', '/token')
}

export async function signup(user: User) {
  return request<string>('POST', '/user', { email: user.email, pwd: user.pwd })
}

import { encodeURIParams, request } from '@/api/util.ts'

export interface UserAuth {
  email: string
  pwd: string
}

export interface UserProfile {
  nickname: string
  avatarUrl: string
}

export interface User extends UserAuth, UserProfile {}

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

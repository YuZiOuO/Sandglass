import { encodeURIParams, request } from '@/api/util.ts'
import type { UserAuth } from '@/api/model.ts'

async function login(authInfo: UserAuth) {
  const url = `/token?${encodeURIParams(authInfo)}`
  return request<string>('GET',url)
}

async function logout(){
  return request<void>('DELETE','/token')
}

login({ email: "test@example.com", pwd : "test_pwd" }).then(r => console.log(r.status))


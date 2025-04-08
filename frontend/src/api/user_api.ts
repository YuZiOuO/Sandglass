import { api, notifyApiError } from './api'
import type { AxiosResponse } from 'axios'
import type { UserAuth } from './model/user'

export async function login(
  params: UserAuth,
  callbackfn: (res: AxiosResponse<string, any>) => void,
) {
  api()
    .get<string>('/token', {
      params: params,
    })
    .then((res) => callbackfn(res))
    .catch(notifyApiError)
}

// export async function signup(

// )

export async function logout(callbackfn: (res: AxiosResponse<null, any>) => void) {
  api()
    .delete<null>('/token')
    .then((res) => callbackfn(res))
    .catch(notifyApiError)
}

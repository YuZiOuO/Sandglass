import axios, { AxiosError, type CreateAxiosDefaults } from 'axios'

import { message } from '@/api/ui_api'

const defaultConfig: CreateAxiosDefaults = {
  baseURL: 'http://127.0.0.1:5173/api',
  timeout: 10000,
  xsrfHeaderName: 'X-CSRF-TOKEN',
  xsrfCookieName: 'csrf_access_token',
  responseEncoding: 'utf-8',
}

export function api(useParams: boolean = false) {
  return axios.create({
    ...defaultConfig,
    headers: useParams
      ? { 'Content-Type': 'application/x-www-form-urlencoded' }
      : { 'Content-Type': 'application/json' },
  })
}

//辅助函数，通过ui通知api错误.
export function notifyApiError(err: AxiosError) {
  message.error('API请求失败:' + err.message + '.打开控制台了解更多.')
  console.log(err)
  return null
}

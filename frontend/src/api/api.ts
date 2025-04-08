import axios from 'axios'

import { message } from '@/ui_api'

axios.defaults.baseURL = 'http://127.0.0.1:5173/api'
axios.defaults.timeout = 10000
axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN'
axios.defaults.xsrfCookieName = 'csrf_access_token'
axios.defaults.responseEncoding = 'utf-8'

export function api(useParams: boolean = false) {
  return axios.create({
    headers: useParams
      ? { 'Content-Type': 'application/x-www-form-urlencoded' }
      : { 'Content-Type': 'application/json' },
  })
}

//辅助函数，通过ui通知api错误.
export function notifyApiError(err: Error) {
  message.error('API请求失败。通过F12打开控制台来了解详情。')
  console.log(err)
  return null
}

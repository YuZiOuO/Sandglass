import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:5173/api'
axios.defaults.timeout = 10000
axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN'
axios.defaults.xsrfCookieName = 'csrf_access_token'
axios.defaults.responseEncoding = 'utf-8'

export const apiEncode = () => {
  return axios.create({
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export const api = () => {
  return axios.create({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const BASE_URL = 'http://127.0.0.1:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Response<T> = { status: number; data: T | string }

async function request<T>(
  method: RequestMethod,
  url: string,
  data?: object,
  config?: AxiosRequestConfig,
): Promise<Response<T>> {
  try {
    const response: AxiosResponse<T | string> = await apiClient({
      method,
      url,
      data,
      ...config,
    })
    console.log(response) //FIXME:debug
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    console.error('API 请求失败:', error)
    throw error
  }
}

const encodeURIParams = (dict: Record<string, string>) => {
  const params = new URLSearchParams()
  Object.entries(dict).forEach(([key, value]) => {
    params.set(key, value)
  })
  return params.toString()
}

export { request, encodeURIParams }

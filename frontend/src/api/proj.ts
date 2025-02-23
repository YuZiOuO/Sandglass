import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { Project } from './model'

const BASE_URL = 'http://localhost:5000'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 定义请求方法的类型
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// 通用请求函数
async function request<T>(
  method: RequestMethod,
  url: string,
  data?: object,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient({
      method,
      url,
      data,
      ...config,
    })

    return response.data // 直接返回数据
  } catch (error) {
    console.error('API 请求失败:', error)
    throw error // 抛出错误，方便调用方处理
  }
}

// 具体 API 请求示例
export async function getProjInfo() {
  return request<Project>('GET', `/proj`)
}

export default request

import { hc } from 'hono/client'
import { useAccessToken } from './firebase'
import type { AppType } from '@sandglass/api'

const useDefaultAuthHeader = async () => {
  return { headers: { Authorization: 'Bearer ' + (await useAccessToken()) } }
}

export const authClient = async () => {
  return hc<AppType>(import.meta.env.SG_WEB_API_BASEURL, await useDefaultAuthHeader())
}

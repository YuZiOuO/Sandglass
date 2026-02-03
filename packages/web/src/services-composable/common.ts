import { hc } from 'hono/client'
import { useAccessToken } from './firebase'
import type { AppType } from '@sandglass/apiv1'

const useDefaultAuthHeader = async () => {
  return { headers: { Authorization: 'Bearer ' + (await useAccessToken()) } }
}

export const authClient = async () => {
  return hc<AppType>(import.meta.env.SG_WEB_APIV1_BASEURL, await useDefaultAuthHeader())
}

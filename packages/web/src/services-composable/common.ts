import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'
import { createAuthClient } from 'better-auth/vue'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'
import type { ClientResponse } from 'hono/client'
import { createDiscreteApi } from 'naive-ui'

export const cli = hc<AppType>(import.meta.env.SG_WEB_API_BASEURL, {
  init: {
    credentials: 'include',
  },
})

export async function processHonoResponse<T, U extends number, F extends string>(
  res: ClientResponse<T, U, F>,
) {
  if (res.ok) {
    return await res.json()
  } else {
    const err = new Error(res.status + ' ' + res.statusText)
    err.name = 'Sandglass API Error'
    throw err
  }
}

export const authCli = createAuthClient({
  baseURL: import.meta.env.SG_WEB_API_BASEURL,
  basePath: '/auth',
})

const UIApi = createDiscreteApi(['notification'])
const notifyError = (err: Error) => {
  UIApi.notification.error({ title: err.name, description: err.message })
}

export const globalQueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: notifyError,
  }),
  mutationCache: new MutationCache({
    onError: notifyError,
  }),
})

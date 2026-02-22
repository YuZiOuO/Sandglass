import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'
import { createAuthClient } from 'better-auth/vue'
import { QueryClient } from '@tanstack/vue-query'

export const cli = hc<AppType>(import.meta.env.SG_WEB_API_BASEURL, {
  init: {
    credentials: 'include',
  },
})
export const authCli = createAuthClient()

export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: () => !!authCli.useSession().value.data,
    },
    mutations: {},
  },
})

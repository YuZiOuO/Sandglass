import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'
import { createAuthClient } from 'better-auth/vue'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'
import type { ClientResponse } from 'hono/client'
import { createDiscreteApi } from 'naive-ui'
import { computed } from 'vue'
import { passkeyClient } from '@better-auth/passkey/client'

/**
 * Hono RPC Client
 */
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

/**
 * Better-auth Client
 */
export const authCli = createAuthClient({
  baseURL: import.meta.env.SG_WEB_API_BASEURL,
  basePath: '/auth',
  plugins: [passkeyClient()],
})

export function useAuthStatus() {
  const session = authCli.useSession()
  const isLoggedIn = computed(() => !!session.value.data?.user)
  return isLoggedIn
}

/**
 * UI Message Api for notifying error
 */
const UIApi = createDiscreteApi(['notification'])
export const notifyError = (err: Error) => {
  UIApi.notification.error({ title: err.name, description: err.message })
}

/**
 * Global TanStack Query Client
 */
export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 60s
    },
  },
  queryCache: new QueryCache({
    onError: notifyError,
  }),
  mutationCache: new MutationCache({
    onError: notifyError,
  }),
})

/**
 * Util Type, used for unknown type infered from Date by hono client
 */
export type FixUnknownDate<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: number | string | Date
}

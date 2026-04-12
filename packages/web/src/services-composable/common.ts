import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'
import { createAuthClient } from 'better-auth/vue'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'
import type { ClientResponse, InferRequestType } from 'hono/client'
import { computed, watchEffect } from 'vue'
import { passkeyClient } from '@better-auth/passkey/client'
import { useStorage } from '@vueuse/core'
import { notifyError, withTraceContext, type TraceableError } from '@/error'

type SandglassApiError = TraceableError

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
    const err = new Error(res.status + ' ' + res.statusText) as SandglassApiError
    err.name = 'Sandglass API Error'
    throw withTraceContext(err, res.headers, res.status, res.statusText)
  }
}

/**
 * Better-auth Client
 */
export const authCli = createAuthClient({
  baseURL: import.meta.env.SG_WEB_API_BASEURL,
  basePath: '/auth',
  fetchOptions: {
    credentials: 'include',
    onError(context) {
      withTraceContext(
        context.error as TraceableError,
        context.response.headers,
        context.response.status,
        context.response.statusText,
      )
    },
  },
  plugins: [passkeyClient()],
})

export function useAuthStatus() {
  const session = authCli.useSession()
  const isLoggedIn = computed(() => !!session.value.data?.user)
  return isLoggedIn
}

const AUTH_CACHE_KEY = 'sandglass_auth_status'
export function useOptimisticAuthStatus() {
  const session = authCli.useSession()
  const hasLocalCache = useStorage(AUTH_CACHE_KEY, false)
  const isLoggedIn = computed(() => {
    if (session.value.data?.user) return true
    if (session.value.isPending && hasLocalCache.value) return true
    return false
  })

  watchEffect(() => {
    if (!session.value.isPending) {
      hasLocalCache.value = !!session.value.data?.user
    }
  })
  return isLoggedIn
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

/**
 * Hono RPC Type Helpers
 *
 * Designed to return `never` if the requested part (json/query/param) is missing
 * in the API definition. This ensures type safety by making the resulting DTO
 * unusable if the contract changes, enforcing a "fail fast" check.
 *
 * If you encounter `never` in a DTO, it likely means the API definition has changed
 * and no longer requires that part of the request.
 */
export type InferBody<T> = InferRequestType<T> extends { json: infer J } ? J : never
export type InferQuery<T> = InferRequestType<T> extends { query: infer Q } ? Q : never
export type InferParam<T> = InferRequestType<T> extends { param: infer P } ? P : never

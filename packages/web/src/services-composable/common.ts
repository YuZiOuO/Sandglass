import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'
import { createAuthClient } from 'better-auth/vue'
import { QueryClient } from '@tanstack/vue-query'
import type { ClientResponse } from 'hono/client'

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
    throw new Error(res.status + ' ' + res.statusText)
  }
}

export const authCli = createAuthClient()

export const globalQueryClient = new QueryClient()

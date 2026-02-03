import { useQuery } from '@tanstack/vue-query'
import { useAccessToken, useFirebase } from './firebase'
import { GoogleAuthApi } from '@/api'
import { globalQueryClient } from '.'
import { authClient } from './common'

const googleOAuthApi = new GoogleAuthApi(undefined, import.meta.env.SG_WEB_API_BASEURL)

export function useGoogleAuthUrlQuery() {
  return useQuery({
    queryKey: ['google-auth', 'url'],
    queryFn: async () => {
      const cli = await authClient()

      const res = await cli.oauth.google.authUrl.$get()
      const data = await res.json()

      return data
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

export function useGoogleAuthStatusQuery() {
  return useQuery({
    queryKey: ['google-auth', 'status'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.oauth.google.token.$get()
      const data = await res.json()
      return data !== null
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

export function useGoogleAccessTokenQuery() {
  return useQuery({
    queryKey: ['google-auth', 'access_token'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.oauth.google.token.$get()
      const data = await res.json()
      return data
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

// Experimental:Only used for composable
export async function useGoogleAccessToken() {
  return await globalQueryClient.fetchQuery({
    queryKey: ['google-auth', 'access_token'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.oauth.google.token.$get()
      const data = await res.json()
      return data !== null
    },
  })
}

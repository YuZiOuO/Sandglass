import { useQuery } from '@tanstack/vue-query'
import { useAccessToken, useFirebase } from './firebase'
import { GoogleAuthApi } from '@/api'

const googleOAuthApi = new GoogleAuthApi(undefined, import.meta.env.SG_WEB_API_BASEURL)

export function useGoogleAuthUrlQuery() {
  return useQuery({
    queryKey: ['google-auth', 'url'],
    queryFn: async () => {
      const token = await useAccessToken()
      const req = googleOAuthApi.getGoogleAuthUrl({ headers: { Authorization: 'Bearer ' + token } })
      return (await req).data
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

export function useGoogleAuthStatusQuery() {
  return useQuery({
    queryKey: ['google-auth', 'status'],
    queryFn: async () => {
      const token = await useAccessToken()
      const req = googleOAuthApi.getGoogleAuthStatus({
        headers: { Authorization: 'Bearer ' + token },
      })
      return (await req).data
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

export function useGoogleAccessTokenQuery() {
  return useQuery({
    queryKey: ['google-auth', 'access_token'],
    queryFn: async () => {
      // const status = useGoogleAuthStatusQuery()
      const token = await useAccessToken()
      const req = googleOAuthApi.getGoogleAccessToken({
        headers: { Authorization: 'Bearer ' + token },
      })
      return (await req).data
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

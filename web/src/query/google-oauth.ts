import { GoogleAuthApi } from '@/api'
import pinia from '@/stores'
import { useAuthenticationStore } from '@/stores/authentication'
import { useQuery } from '@tanstack/vue-query'

const authenticationStore = useAuthenticationStore(pinia)

const googleOAuthApi = new GoogleAuthApi(undefined, import.meta.env.SG_WEB_API_BASEURL)

function useGoogleOAuthToken(userIdentifier: string) {
  return useQuery({
    queryKey: ['google-oauth-token', userIdentifier],
    queryFn: async () => {
      return googleOAuthApi
        .getGoogleAccessToken(await authenticationStore.constructDefaultAxiosAuthHeader())
        .then((res) => res.data)
    },
  })
}

function useGoogleOAuthStatus(userIdentifier: string) {
  return useQuery({
    queryKey: ['google-oauth-status', userIdentifier],
    queryFn: async () => {
      console.log(await authenticationStore.constructDefaultAxiosAuthHeader())
      return googleOAuthApi
        .getGoogleAuthStatus(await authenticationStore.constructDefaultAxiosAuthHeader())
        .then((res) => res.data)
    },
  })
}

function useGoogleOAuthUrl(userIdentifier: string) {
  return useQuery({
    queryKey: ['google-oauth-url', userIdentifier],
    queryFn: async () => {
      return googleOAuthApi
        .getGoogleAuthUrl(await authenticationStore.constructDefaultAxiosAuthHeader())
        .then((res) => res.data)
    },
  })
}

export function useGoogleOAuthAPI() {
  return {
    useToken: useGoogleOAuthToken,
    useStatus: useGoogleOAuthStatus,
    useUrl: useGoogleOAuthUrl,
  }
}

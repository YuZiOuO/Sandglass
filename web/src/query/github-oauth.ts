import { GithubAuthApi } from '@/api'
import pinia from '@/stores'
import { useAuthenticationStore } from '@/stores/authentication'
import { useQuery } from '@tanstack/vue-query'

const authenticationStore = useAuthenticationStore(pinia)

const githubOAuthApi = new GithubAuthApi(undefined, import.meta.env.SG_WEB_API_BASEURL)

function useGithubOAuthStatus(userIdentifier: string) {
  return useQuery({
    queryKey: ['github-oauth-token', userIdentifier],
    queryFn: async () => {
      return githubOAuthApi
        .getGithubAuthStatus(await authenticationStore.constructDefaultAxiosAuthHeader())
        .then((res) => res.data)
    },
  })
}

function useGithubOAuthUrl(userIdentifier: string) {
  return useQuery({
    queryKey: ['github-oauth-token', userIdentifier],
    queryFn: async () => {
      return githubOAuthApi
        .getGithubAuthUrl(await authenticationStore.constructDefaultAxiosAuthHeader())
        .then((res) => res.data)
    },
  })
}

export function useGithubOAuthAPI() {
  return {
    useStatus: useGithubOAuthStatus,
    useUrl: useGithubOAuthUrl,
  }
}

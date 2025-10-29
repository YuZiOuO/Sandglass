import { useQuery } from '@tanstack/vue-query'
import { useAccessToken, useFirebase } from './firebase'
import { GithubAuthApi } from '@/api'

const githubOAuthApi = new GithubAuthApi(undefined, import.meta.env.SG_WEB_API_BASEURL)

export function useGithubAuthUrlQuery() {
  return useQuery({
    queryKey: ['github-auth', 'url'],
    queryFn: async () => {
      const token = await useAccessToken()
      const req = githubOAuthApi.getGithubAuthUrl({ headers: { Authorization: 'Bearer ' + token } })
      return (await req).data
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

export function useGithubAuthStatusQuery() {
  return useQuery({
    queryKey: ['github-auth', 'status'],
    queryFn: async () => {
      const token = await useAccessToken()
      const req = githubOAuthApi.getGithubAuthStatus({
        headers: { Authorization: 'Bearer ' + token },
      })
      return (await req).data
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

import { useQuery } from '@tanstack/vue-query'
import { useFirebase } from './firebase'
import { authClient } from './common'

export function useGithubAuthUrlQuery() {
  return useQuery({
    queryKey: ['github-auth', 'url'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.oauth.github.authUrl.$get()
      const url = await res.json()

      return url
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

export function useGithubAuthStatusQuery() {
  return useQuery({
    queryKey: ['github-auth', 'status'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.oauth.github.token.$get()
      const token = await res.json()

      return token !== null
    },
    enabled: useFirebase().auth.currentUser !== null,
  })
}

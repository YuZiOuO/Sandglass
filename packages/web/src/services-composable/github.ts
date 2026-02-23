import { skipToken, useQuery } from '@tanstack/vue-query'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { authCli } from './common'
import type { Endpoints } from '@octokit/types'
import { Octokit } from 'octokit'

const useAuthOctokit = async () => {
  const token = await authCli.getAccessToken({
    providerId: 'github',
  })

  if (token.error || !token.data?.accessToken) {
    throw new Error('No GitHub access token')
  }

  const octokit = new Octokit({
    auth: token.data.accessToken,
  })
  return octokit
}

type ListRepoCommitsEndpoint = Endpoints['GET /repos/{owner}/{repo}/commits']
export function useGithubListRepoCommitsQuery(
  owner: MaybeRefOrGetter<string | undefined>,
  repo: MaybeRefOrGetter<string | undefined>,
) {
  return useQuery({
    queryKey: ['github', 'commits', owner, repo],
    queryFn:
      toValue(owner) && toValue(repo)
        ? async () => {
            const octokit = await useAuthOctokit()

            const params: ListRepoCommitsEndpoint['parameters'] = {
              owner: toValue(owner)!,
              repo: toValue(repo)!,
            }

            const res = await octokit.paginate<ListRepoCommitsEndpoint['response']['data']>({
              method: 'GET',
              url: '/repos/{owner}/{repo}/commits',
              ...params,
            })

            return res.flat()
          }
        : skipToken, // used for narrowing type
  })
}

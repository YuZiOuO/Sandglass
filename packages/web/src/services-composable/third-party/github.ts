import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { globalQueryClient } from '../common'
import { getCachedAccessToken, invalidateAccessToken } from '../auth-cache'
import { Octokit } from 'octokit'

const useAuthOctokit = async () => {
  const token = await getCachedAccessToken({
    providerId: 'github',
  })

  if (token.error || !token.data?.accessToken) {
    const err = new Error('failed to retrive access token.')
    err.name = 'Github API Error'
    throw err
  }

  const octokit = new Octokit({
    auth: token.data.accessToken,
  })

  octokit.hook.error('request', async (error) => {
    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      invalidateAccessToken('github')
    }
    throw error
  })

  return octokit
}

export function useGithubListRepoCommitsQuery(
  owner: MaybeRefOrGetter<string | undefined>,
  repo: MaybeRefOrGetter<string | undefined>,
  since?: MaybeRefOrGetter<Date | undefined>,
  until?: MaybeRefOrGetter<Date | undefined>,
) {
  const params = computed(() => ({
    owner: toValue(owner),
    repo: toValue(repo),
    since: toValue(since),
    until: toValue(until),
  }))

  return useQuery({
    queryKey: ['github', 'commits', params],
    queryFn: async () => {
      const { owner, repo, since, until } = params.value
      const octokit = await useAuthOctokit()

      const res = await octokit.paginate(octokit.rest.repos.listCommits, {
        owner: owner!,
        repo: repo!,
        since: since?.toISOString(),
        until: until?.toISOString(),
      })

      return res.flat()
    },
    enabled: () => !!params.value.owner && !!params.value.repo,
  })
}

export function useGithubReposOfAuthenticatedUserQuery() {
  return useQuery({
    queryKey: ['github', 'repos', 'me'],
    queryFn: async () => {
      const octokit = await useAuthOctokit()
      const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser)
      return repos.flat()
    },
  })
}

export type CreateRepositoryDTO = NonNullable<
  Parameters<Octokit['rest']['repos']['createForAuthenticatedUser']>[0]
>

export function useGithubRepositoryCreateMutation() {
  return useMutation({
    mutationFn: async (params: CreateRepositoryDTO) => {
      const octokit = await useAuthOctokit()
      if (!params || !params.name) throw new Error('Repository name is required')

      const { data } = await octokit.rest.repos.createForAuthenticatedUser({
        ...params,
        name: params.name!,
      })
      return data
    },
    onSuccess: () => {
      globalQueryClient.invalidateQueries({ queryKey: ['github', 'repos', 'me'] })
    },
  })
}

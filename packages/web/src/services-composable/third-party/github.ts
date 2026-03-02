import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { authCli } from '../common'
import { Octokit } from 'octokit'

const useAuthOctokit = async () => {
  const token = await authCli.getAccessToken({
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

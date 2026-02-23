import { useQuery } from '@tanstack/vue-query'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { authCli } from './common'
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

export function useGithubListRepoCommitsQuery(
  owner: MaybeRefOrGetter<string | undefined>,
  repo: MaybeRefOrGetter<string | undefined>,
  since?: MaybeRefOrGetter<Date | undefined>,
  until?: MaybeRefOrGetter<Date | undefined>,
) {
  return useQuery({
    queryKey: ['github', 'commits', owner, repo, since, until],
    queryFn: async () => {
      const octokit = await useAuthOctokit()

      const res = await octokit.paginate(octokit.rest.repos.listCommits, {
        owner: toValue(owner)!,
        repo: toValue(repo)!,
        since: toValue(since)?.toISOString(),
        until: toValue(until)?.toISOString(),
      })
      
      return res.flat()
    },
    enabled: () => !!toValue(owner) && !!toValue(repo)
  })
}

export function useGithubReposOfAuthenticatedUserQuery() {
  return useQuery({
    queryKey: ['github', 'me'],
    queryFn: async () => {
      const octokit = await useAuthOctokit()
      const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser)
      return repos.flat()
    },
  })
}

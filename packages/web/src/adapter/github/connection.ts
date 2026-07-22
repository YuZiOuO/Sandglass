import type { RepoCapability } from '@/capability/repo'
import { Octokit } from '@octokit/rest'

import { GithubRepoCapability, GithubRepositoryCapability } from './repo'
import type { Capability, Connection } from '@/interfaces'
import { cli } from '@/lib'

export class GithubConnection implements Connection {
  readonly capabilities: readonly Capability[]
  readonly repoCapability: RepoCapability
  readonly repositoryCapability: GithubRepositoryCapability
  private client: Octokit | undefined

  constructor() {
    const getClient = () => {
      if (!this.client) {
        throw new Error('GitHub is not authenticated.')
      }

      return this.client
    }

    this.repoCapability = new GithubRepoCapability(getClient)
    this.repositoryCapability = new GithubRepositoryCapability(getClient)
    this.capabilities = [this.repoCapability, this.repositoryCapability]
  }

  authorize() {
    const url = cli.github.authorize.$url()
    url.searchParams.set('prompt', 'login')
    globalThis.location.assign(url.toString())
  }

  async restore() {
    const response = await cli.github['access-token'].$post(
      {},
      {
        init: {
          credentials: 'include',
        },
      },
    )

    if (!response.ok) {
      this.client = undefined
      return false
    }

    const { authenticated, accessToken } = await response.json()
    this.client = authenticated && accessToken ? new Octokit({ auth: accessToken }) : undefined
    return authenticated
  }
}

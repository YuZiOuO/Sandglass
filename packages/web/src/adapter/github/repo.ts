import { Octokit } from '@octokit/rest'

import type { Activity, RepoCapability } from '@/capability/repo'
import type { Scope, Scoped } from '@/interfaces'

const PER_PAGE = 100

export class GithubRepoCapability implements RepoCapability {
  constructor(
    private readonly getClient: () => Octokit,
    private readonly repositoryId?: string,
  ) {}

  async list(range: { from: Date; to: Date }) {
    const login = (await this.getClient().rest.users.getAuthenticated()).data.login
    const repository = this.repositoryId
      ? ` repo:${
          (
            await this.getClient().request('GET /repositories/{repository_id}', {
              repository_id: Number(this.repositoryId),
            })
          ).data.full_name
        }`
      : ''
    const date = `${range.from.toISOString().slice(0, 10)}..${range.to.toISOString().slice(0, 10)}`

    const [commits, issues, pullRequests] = await Promise.all([
      this.listCommits(login, repository, date, range),
      this.listIssues(login, repository, date, range),
      this.listPullRequests(login, repository, date, range),
    ])

    return [...commits, ...issues, ...pullRequests].sort(
      (left, right) => left.time.getTime() - right.time.getTime(),
    )
  }

  private async listCommits(
    login: string,
    repository: string,
    date: string,
    range: { from: Date; to: Date },
  ) {
    const items = await this.getClient().paginate(this.getClient().rest.search.commits, {
      q: `author:${login}${repository} author-date:${date}`,
      per_page: PER_PAGE,
    })

    return items.flatMap((item): Activity[] => {
      const time = item.commit.author?.date ?? item.commit.committer?.date
      const date = time ? new Date(time) : undefined
      return date && date >= range.from && date < range.to
        ? [
            {
              kind: 'commit',
              time: date,
              description: item.commit.message.split('\n', 1)[0],
            },
          ]
        : []
    })
  }

  private listIssues(
    login: string,
    repository: string,
    date: string,
    range: { from: Date; to: Date },
  ) {
    return this.listSearchActivities(
      `author:${login}${repository} type:issue created:${date}`,
      'issue',
      range,
    )
  }

  private listPullRequests(
    login: string,
    repository: string,
    date: string,
    range: { from: Date; to: Date },
  ) {
    return this.listSearchActivities(
      `author:${login}${repository} type:pr created:${date}`,
      'pull-request',
      range,
    )
  }

  private async listSearchActivities(
    query: string,
    kind: Extract<Activity['kind'], 'issue' | 'pull-request'>,
    range: { from: Date; to: Date },
  ) {
    const items = await this.getClient().paginate(
      this.getClient().rest.search.issuesAndPullRequests,
      { q: query, per_page: PER_PAGE },
    )

    return items.flatMap((item): Activity[] => {
      const time = new Date(item.created_at)
      return time >= range.from && time < range.to ? [{ kind, time, description: item.title }] : []
    })
  }
}

export class GithubRepositoryCapability implements Scoped<RepoCapability> {
  constructor(private readonly getClient: () => Octokit) {}

  async listScopes() {
    const repositories = await this.getClient().paginate(
      this.getClient().rest.repos.listForAuthenticatedUser,
      {
        affiliation: 'owner,collaborator,organization_member',
        visibility: 'all',
        per_page: PER_PAGE,
      },
    )

    return repositories.map<Scope>((repository) => ({
      id: String(repository.id),
      name: repository.full_name,
    }))
  }

  forScope(id: string) {
    return new GithubRepoCapability(this.getClient, id)
  }
}

import type { Capability, Connection } from '@/interfaces'
import { cli } from '@/lib'

export class GithubConnection implements Connection {
  readonly capabilities: readonly Capability[]

  constructor() {
    this.capabilities = []
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
      return false
    }

    const { authenticated } = await response.json()
    return authenticated
  }
}

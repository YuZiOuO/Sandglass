import { cli } from '@/lib'
import { GoogleMailCapability } from './mail'
import type { Capability, Connection } from '@/interfaces'

export class GoogleConnection implements Connection {
  readonly capabilities: readonly Capability[]
  readonly mailCapability: GoogleMailCapability
  private accessToken = ''

  constructor() {
    this.mailCapability = new GoogleMailCapability(() => {
      if (!this.accessToken) {
        throw new Error('Google is not authenticated.')
      }

      return {
        Authorization: `Bearer ${this.accessToken}`,
      }
    })
    this.capabilities = [this.mailCapability]
  }

  authorize() {
    globalThis.location.assign(cli.google.authorize.$url().toString())
  }

  async restore() {
    const response = await cli.google['access-token'].$post(
      {},
      {
        init: {
          credentials: 'include',
        },
      },
    )

    if (!response.ok) {
      this.accessToken = ''
      return false
    }

    const { authenticated, accessToken } = await response.json()
    this.accessToken = accessToken

    return authenticated
  }
}

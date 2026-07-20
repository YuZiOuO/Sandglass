import { cli } from '@/main'
import type { Capability } from '../../core/capability'
import type { Connection } from '../../core/connection'
import { GoogleMailCapability } from './mail'

export class GoogleConnection implements Connection {
  readonly capabilities: readonly Capability[]
  private readonly mailCapability: GoogleMailCapability
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

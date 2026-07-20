import type { Capability } from '../../core/capability'
import type { Connection } from '../../core/connection'
import { GoogleMailCapability } from './mail'

const API_ROOT = import.meta.env.VITE_API_ROOT ?? ''

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
    globalThis.location.assign(`${API_ROOT}/google/authorize`)
  }

  async restore() {
    const response = await fetch(`${API_ROOT}/google/access-token`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      this.accessToken = ''
      return false
    }

    const session = (await response.json()) as { authenticated: boolean; accessToken: string }
    this.accessToken = session.accessToken
    return session.authenticated
  }
}

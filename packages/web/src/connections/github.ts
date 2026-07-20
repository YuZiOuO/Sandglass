import type { Capability } from '../core/capability'
import type { Connection } from '../core/connection'

// TODO:Implmentation

export class GithubConnection implements Connection {
  readonly capabilities: readonly Capability[]

  constructor() {
    this.capabilities = []
  }

  authorize() {}

  async restore() {
    return true
  }
}

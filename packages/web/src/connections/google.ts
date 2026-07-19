import type { Capability } from '../core/capability'
import type { Connection } from '../core/connection'

// TODO:Implmentation

export class GoogleConnection implements Connection {
  readonly capabilities: readonly Capability[]

  constructor() {
    this.capabilities = []
  }

  async check() {
    return true
  }
}

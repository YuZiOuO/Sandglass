import type { Capability } from './capability'

export interface Connection {
  check: () => Promise<boolean>
  readonly capabilities: readonly Capability[]
}

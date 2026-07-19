import type { Capability } from './capability'

export interface Connection {
  set: () => Promise<void>
  check: () => Promise<boolean>
  readonly capabilities: readonly Capability[]
}

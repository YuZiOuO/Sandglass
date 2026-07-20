import type { Capability } from './capability'

export interface Connection {
  /** Starts the provider-specific user authorization flow. */
  authorize: () => void

  /** Restores persisted authorization and prepares the capabilities. */
  restore: () => Promise<boolean>

  readonly capabilities: readonly Capability[]
}

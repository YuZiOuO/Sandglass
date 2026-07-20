import type { Component } from 'vue'

export interface Connection {
  /** Starts the provider-specific user authorization flow. */
  authorize: () => void

  /** Restores persisted authorization and prepares the capabilities. */
  restore: () => Promise<boolean>

  readonly capabilities: readonly Capability[]
}

export type Plugin = Component<{
  capabilities: readonly Capability[]
}>

// Intentional marker interface for capability services.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Capability {}

import type { Component } from 'vue'

export interface Connection {
  /** Starts the provider-specific user authorization flow. */
  authorize: () => void

  /** Restores persisted authorization and prepares the capabilities. */
  restore: () => Promise<boolean>

  readonly capabilities: readonly Capability[]
}

export type Plugin<C extends readonly Capability[] = readonly Capability[]> = Component<{
  capabilities: C
}>

// Intentional marker interface for capability services.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Capability {}

export interface Scoped<C extends Capability> extends Capability {
  listScopes: () => Promise<readonly Scope[]>
  forScope: (id: string) => C
}

export type Scope = {
  id: string
  name: string
}

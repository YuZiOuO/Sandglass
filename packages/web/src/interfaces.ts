import type { Component } from 'vue'
import type { JsonObject, JsonValue } from 'type-fest'

export type { JsonObject, JsonValue }

export interface Connection {
  /** Starts the provider-specific user authorization flow. */
  authorize: () => void

  /** Restores persisted authorization and prepares the capabilities. */
  restore: () => Promise<boolean>

  readonly capabilities: readonly Capability[]
}

export interface StatePort<S extends JsonValue> {
  read: () => S
  write: (value: S) => void
}

export type Plugin<
  C extends readonly Capability[] = readonly Capability[],
  S extends JsonObject = JsonObject,
> = Component<{
  capabilities: C
  state?: StatePort<S>
}>

// Intentional marker interface for capability services.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Capability {}

export interface Scoped<C extends Capability> extends Capability {
  listScopes: () => Promise<readonly Scope[]>
  forScope: (id: string) => C
}

export interface MutableScoped<C extends Capability, I = string> extends Scoped<C> {
  createScope: (input: I) => Promise<Scope>
}

export type Scope = {
  id: string
  name: string
}

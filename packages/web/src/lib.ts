import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'
import { defineStore } from 'pinia'
import { h, type Component } from 'vue'
import type { Capability, JsonObject, Plugin, StatePort } from './interfaces'

export const cli = hc<AppType>(import.meta.env.VITE_API_ROOT ?? '')

function createPiniaStatePort<S extends JsonObject>(store: {
  $state: S
  $patch: (state: Partial<S>) => void
}): StatePort<S> {
  return {
    // Clone JSON state.
    read: () => JSON.parse(JSON.stringify(store.$state)) as S,
    write: (value) => store.$patch(value),
  }
}

// Adapt state for SyncManager.
function toSyncSource<S extends JsonObject>(id: string, state: StatePort<S>) {
  return {
    id,
    port: {
      // SAFETY: S is constrained to JsonObject.
      read: () => state.read() as JsonObject,
      // SAFETY: the source writes back its own persisted shape.
      write: (value: JsonObject) => state.write(value as S),
    },
  }
}

export function createPlugin<
  C extends readonly Capability[] = readonly Capability[],
  S extends JsonObject = JsonObject,
>(config: {
  id: string
  state?: () => S
  capabilities: (state: StatePort<S>) => C
  component: Plugin<C, S>
}) {
  const state = config.state
    ? (() => {
        const useStore = defineStore(`plugin:${config.id}`, {
          // SAFETY: S extends JsonObject, which is a valid Pinia state shape.
          state: config.state as () => JsonObject,
          persist: true,
        })
        // SAFETY: only the compatible Pinia state API is used.
        const store = useStore() as unknown as {
          $state: JsonObject
          $patch: (state: Partial<JsonObject>) => void
        }
        // SAFETY: the store was created from config.state.
        return createPiniaStatePort(store) as unknown as StatePort<S>
      })()
    : undefined
  // Unused by stateless plugins.
  // SAFETY: stateless capability factories ignore this argument.
  const capabilities = config.capabilities(state as StatePort<S>)
  const runtime = {
    id: config.id,
    capabilities,
    component: () =>
      // SAFETY: Vue's h() cannot preserve Plugin's conditional props.
      h(config.component as Component, { capabilities, ...(state ? { state } : {}) }),
  }

  return {
    ...runtime,
    ...(state ? { state, syncSource: toSyncSource(config.id, state) } : {}),
  }
}

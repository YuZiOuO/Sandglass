import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'
import { defineStore } from 'pinia'
import { computed, h, type Component } from 'vue'
import type { Capability, JsonObject, Plugin, StatePort } from './interfaces'

export type PluginRuntime = {
  id: string
  profile: {
    title: string
    icon: Component
    layout: {
      w: number
      h: number
      minW: number
      minH: number
    }
  }
  unavailableText?: string
  available: () => boolean
  component: Component
}

export const cli = hc<AppType>(import.meta.env.VITE_API_ROOT ?? '')

export function createState<S extends JsonObject>(id: string, initialState: () => S) {
  const useStore = defineStore(`plugin:${id}`, {
    state: initialState,
    persist: true,
  })
  // SAFETY: the store is defined from initialState, so its Pinia state matches S.
  const store = useStore() as unknown as {
    $state: S
    $patch: (state: Partial<S>) => void
  }
  const state: StatePort<S> = {
    // SAFETY: JSON serialization preserves the JsonObject state shape.
    read: () => JSON.parse(JSON.stringify(store.$state)) as S,
    write: (value) => store.$patch(value),
  }

  return {
    state,
    syncSource: {
      id,
      port: {
        // SAFETY: S is constrained to JsonObject.
        read: () => state.read() as JsonObject,
        // SAFETY: the source writes back its own persisted shape.
        write: (value: JsonObject) => state.write(value as S),
      },
    },
  }
}

export function createPlugin<
  C extends readonly Capability[] = readonly Capability[],
  S extends JsonObject = JsonObject,
>(config: {
  id: string
  profile: PluginRuntime['profile']
  unavailableText?: string
  state?: () => S
  capabilities: (state: StatePort<S>) => C | undefined
  component: Plugin<C, S>
}) {
  const persisted = config.state ? createState(config.id, config.state) : undefined
  const state = persisted?.state
  // Unused by stateless plugins.
  // SAFETY: stateless capability factories ignore this argument.
  const capabilities = computed(() => config.capabilities(state as StatePort<S>))
  const runtime: PluginRuntime = {
    id: config.id,
    profile: config.profile,
    ...(config.unavailableText ? { unavailableText: config.unavailableText } : {}),
    available: () => capabilities.value !== undefined,
    component: () =>
      capabilities.value
        ? // SAFETY: Vue's h() cannot preserve Plugin's conditional props.
          h(config.component as Component, {
            capabilities: capabilities.value,
            ...(state ? { state } : {}),
          })
        : null,
  }

  return {
    ...runtime,
    ...persisted,
  }
}

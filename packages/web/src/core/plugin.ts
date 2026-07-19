import type { Component } from 'vue'
import type { Capability } from './capability'

export type Plugin = Component<{
  capabilities: readonly Capability[]
}>

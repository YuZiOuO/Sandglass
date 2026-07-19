import type { Component } from 'vue'
import type { Capability } from './capability'

export interface Plugin {
  name: string
  factory: (c: Capability[]) => {
    commands: Command[]
    views: Component[]
  }
}

type Command = {
  name: string
  execute: () => void | Promise<void>
}

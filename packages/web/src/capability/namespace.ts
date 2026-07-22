import type { Capability } from '@/interfaces'

export interface NamespaceCapability extends Capability {
  list: () => Promise<readonly Namespace[]>
  create: (name: string) => Promise<Namespace>
  rename: (id: string, name: string) => Promise<Namespace>
  remove: (id: string) => Promise<void>
}

export type Namespace = {
  id: string
  name: string
}

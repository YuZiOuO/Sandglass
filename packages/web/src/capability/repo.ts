import type { Capability } from '@/interfaces'

export interface RepoCapability extends Capability {
  list: (range: { from: Date; to: Date }) => Promise<readonly Activity[]>
}

export type Activity = {
  kind: 'commit' | 'issue' | 'pull-request'
  time: Date
  description?: string
}

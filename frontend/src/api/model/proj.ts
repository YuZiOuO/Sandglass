import type { Node, Task } from './node'
import type { Attachment } from './atmt'

export interface Project {
  id: string

  name: string
  owner: string //owner_id

  url: string | undefined
  description: string | undefined
  start_timestamp: number | undefined
  end_timestamp: number | undefined

  tasks: Task[]
  nodes: Node[]
  attachments: Attachment[]
}

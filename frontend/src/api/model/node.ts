import type { Attachment } from './atmt'

// 这个Node好像和JS的内置Node撞名了
interface Node {
  id: string

  name: string
  timestamp: number
  finished: boolean

  description: string | undefined
  url: string | undefined
  attachment: Attachment[]
}

interface Task extends Node {
  start_timestamp: number | undefined
}

export type { Node, Task }

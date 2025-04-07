import type { Attachment } from './atmt'

// 这个Node好像和JS的内置Node撞名了
export interface Node {
  id: string

  name: string
  timestamp: number
  finished: boolean

  description: string | undefined
  url: string | undefined
  attachment: Attachment[]
}

export interface Task extends Node {
  start_timestamp: number | undefined
}

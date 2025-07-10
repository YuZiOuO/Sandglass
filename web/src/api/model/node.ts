import type { Attachment } from './atmt'

interface minimumNode {
  name: string
  timestamp: number
}

interface optionalNode {
  finished: boolean
  description: string | undefined
  url: string | undefined
  attachment: Attachment[]
}

interface controlledNode {
  id: string
}

// 这个Node和JS的内置Node撞名了，需要手动导入才能在脚本中使用
interface Node extends minimumNode, optionalNode, controlledNode {}

interface Task extends Node {
  start_timestamp: number | undefined
}

export type { minimumNode, optionalNode, controlledNode, Node, Task }

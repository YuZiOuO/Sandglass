import type { Capability } from '@/interfaces'

export interface TaskCapability extends Capability {
  list: () => Promise<readonly Task[]>
  create: (input: CreateTaskInput) => Promise<Task>
  update: (id: string, patch: UpdateTaskInput) => Promise<Task>
  remove: (id: string) => Promise<void>
}

// Task hierarchy is intentionally flattened in the initial contract.
export type Task = {
  id: string
  title: string
  notes?: string
  dueDate?: string
  completed: boolean
}

export type CreateTaskInput = Omit<Task, 'id' | 'completed'>
export type UpdateTaskInput = Partial<Omit<Task, 'id'>>

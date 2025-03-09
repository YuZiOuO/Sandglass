export interface Project {
  projName: string
  ID: string
  startTimestamp: string
  endTimestamp: string
  avatarUrl: string
  description: string
  tasks: Array<Task>
}

export interface Task {
  taskName: string
  UUID: string
  deadline: string
  description: string
}

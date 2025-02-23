export type Project = {
  projName: string
  UUID: string
  startTimestamp: string
  endTimestamp: string
  avatarUrl: string
  description: string
  tasks: Array<Task>
}

export type Task = {
  taskName: string
  UUID: string
  deadline: string
  description: string
}

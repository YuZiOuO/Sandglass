export interface Project {
  name: string
  start_timestamp: number
  end_timestamp: number
  avatarUrl: string
  description: string
  task: Array<Task>
  status: string
}

export interface NewProject {
  name: string
  start_timestamp: number
  end_timestamp: number
}

export interface Task {
  taskName: string
  UUID: string
  deadline: string
  description: string
}

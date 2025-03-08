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

export type UserAuth = {
  email: string
  pwd: string
}

export type UserProfile = {
  nickname: string
  avatarUrl: string
}

export type User = {
  auth: UserAuth
  profile: UserProfile
}

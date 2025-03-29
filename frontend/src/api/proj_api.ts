import { request } from './util'

export interface Project {
  id: string
  name: string
  url: string | null
  description: string | null
  start_timestamp: number
  end_timestamp: number
  tasks: Array<Task>
  nodes: Array<Node>
  attachments: Array<Attachment>
}

// 这个Node好像和JS的内置Node撞名了
export interface Node {
  id: string
  name: string
  timestamp: number
  finished: boolean
  description: string | null
  url: string | null
}

export interface Task {
  id: string
  name: string
  end_timestamp: number
  finished: boolean
  url: string | null
  attachment: Array<Attachment> | null
  start_timestamp: number | null
  description: string | null
}

export interface Attachment {
  id: string
  name: string
  url: string
}

export interface NewProject {
  name: string
  start_timestamp: number
  end_timestamp: number
}

export async function get_proj_by_id(id: string | null) {
  if (id != null) {
    return await request<Project>('GET', '/proj/' + id)
  }
}

export async function create_proj(proj: Project) {
  return await request<string>('POST', '/proj', proj)
}

export async function get_proj_by_currrent_user() {
  return await request<string>('GET', '/proj')
}

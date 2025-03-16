import type { Project } from './model/proj_model'
import { request } from './util'

export async function get_proj_by_id(id: string | null) {
  if (id != null) {
    return await request<Project>('GET', '/proj/' + id)
  }
}

export async function create_proj(proj: Project) {
  return await request<string>('POST', '/proj', proj)
}

import type { Project } from './model/proj_model'
import { encodeURIParams, request } from './util'

export async function get_proj_by_id(id: string | null) {
  if (id != null) {
    return request<Project>('GET', '/proj/' + encodeURIParams({ id: id }))
  }
}

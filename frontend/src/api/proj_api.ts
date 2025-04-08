import type { AxiosResponse } from 'axios'

import {
  api,
  notifyApiError,
} from './api'
import type { ObjectID } from './bson_util'
import type {
  minimumProject,
  optionalProject,
  ProjectBSON,
} from './model/proj'

export async function get_proj(id: string, callbackfn: (res: AxiosResponse<ProjectBSON>) => void) {
  api()
    .get<ProjectBSON>('/proj' + id) //FIXME:安全风险
    .then((res) => {
      callbackfn(res)
    })
    .catch(notifyApiError)
}

export async function get_projs(
  select_related: boolean,
  callbackfn: (res: AxiosResponse<ProjectBSON[] | ObjectID[]>) => void,
) {
  api(true)
    .get<ProjectBSON[] | ObjectID[]>('/proj', {
      params: {
        select_related: select_related,
      },
    })
    .then((res) => {
      callbackfn(res)
    })
    .catch(notifyApiError)
}

export async function create_proj(
  params: Partial<minimumProject | optionalProject>,
  callbackfn: (res: AxiosResponse<string>) => void,
) {
  api()
    .post<string>('/proj', { params: params })
    .then((res) => callbackfn(res))
    .catch(notifyApiError)
}

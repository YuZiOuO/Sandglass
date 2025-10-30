import { useQuery } from '@tanstack/vue-query'
import { useAccessToken } from './firebase'
import { ProjectApi } from '@/api'
import type { Ref } from 'vue'

const projectApi = new ProjectApi(undefined, import.meta.env.SG_WEB_API_BASEURL)

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['project'],
    queryFn: async () => {
      const res = await projectApi.listProject({
        headers: { Authorization: 'Bearer ' + (await useAccessToken()) },
      })

      return res.data
    },
  })
}

export function useProjectQuery(projectId: Ref<string>) {
  return useQuery({
    queryKey: ['calendar', projectId.value],
    queryFn: async (context) => {
      const id = context.queryKey[1]
      const res = await projectApi.getProject(id, {
        headers: { Authorization: 'Bearer ' + (await useAccessToken()) },
      })

      return res.data
    },
  })
}

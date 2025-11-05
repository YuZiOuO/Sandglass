import { useMutation, useQuery } from '@tanstack/vue-query'
import { useAccessToken } from './firebase'
import { ProjectApi, type ProjectCreateDTO } from '@/api'
import { computed, type Ref } from 'vue'

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
    queryKey: computed(() => ['project', projectId.value]),
    queryFn: async (context) => {
      const id = context.queryKey[1]
      const res = await projectApi.getProject(id, {
        headers: { Authorization: 'Bearer ' + (await useAccessToken()) },
      })

      return res.data
    },
  })
}

export function useProjectMutation() {
  return useMutation({
    mutationKey: ['project'],
    mutationFn: async (project: ProjectCreateDTO) => {
      projectApi.createProject(project)
    },
  })
}

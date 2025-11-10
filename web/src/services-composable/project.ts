import { useMutation, useQuery } from '@tanstack/vue-query'
import { useAccessToken } from './firebase'
import { ProjectApi, type ProjectCreateDTO } from '@/api'
import { type Ref } from 'vue'

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
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await projectApi.getProject(projectId.value, {
        headers: { Authorization: 'Bearer ' + (await useAccessToken()) },
      })

      return res.data
    },
    enabled: projectId.value.length > 0,
  })
}

export function useCreateProject() {
  return useMutation({
    mutationKey: ['project'],
    mutationFn: async (project: ProjectCreateDTO) => {
      projectApi.createProject(project)
    },
  })
}

export function useDeleteProject(id: string) {
  return useMutation({
    mutationKey: ['project', id],
    mutationFn: async () => {
      await projectApi.deleteProject(id, {
        headers: { Authorization: 'Bearer ' + (await useAccessToken()) },
      })
    },
  })
}

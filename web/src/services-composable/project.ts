import { useMutation, useQuery } from '@tanstack/vue-query'
import { useAccessToken } from './firebase'
import { ProjectApi, type ProjectCreateDTO } from '@/api'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

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

export function useProjectQuery(projectId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await projectApi.getProject(toValue(projectId), {
        headers: { Authorization: 'Bearer ' + (await useAccessToken()) },
      })

      return res.data
    },
    enabled: computed(() => toValue(projectId).length > 0),
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

export function useDeleteProject() {
  return useMutation({
    mutationKey: ['project'],
    mutationFn: async (id: string) => {
      await projectApi.deleteProject(id, {
        headers: { Authorization: 'Bearer ' + (await useAccessToken()) },
      })
    },
  })
}

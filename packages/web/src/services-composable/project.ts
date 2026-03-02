import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { cli, globalQueryClient, processHonoResponse, useAuthStatus } from './common'
import type { InferRequestType } from 'hono'
import { resourcesKeys } from './resources'

const projectKeys = {
  namespace: ['project'] as const,
  project: (projectId: string) => [...projectKeys.namespace, projectId] as const,
}

export function useProjectListQuery() {
  return useQuery({
    queryKey: projectKeys.namespace,
    queryFn: async () => {
      const res = await cli.project.my.$get()
      return await processHonoResponse(res)
    },
    enabled: () => useAuthStatus().value,
  })
}

export function useProjectQuery(projectId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(projectId))
  return useQuery({
    queryKey: computed(() => projectKeys.project(id.value)),
    queryFn: async () => {
      const res = await cli.project.$get({ query: { id: id.value } })
      return await processHonoResponse(res)
    },
    enabled: () => useAuthStatus().value && !!id.value,
  })
}

export type ProjectCreateDTO = InferRequestType<typeof cli.project.$post>['json']
export function useProjectCreateMutation() {
  return useMutation({
    mutationFn: async (dto: ProjectCreateDTO) => {
      const createdProject = await cli.project.$post({ json: { ...dto } })
      return await processHonoResponse(createdProject)
    },
    onSuccess: async () => {
      await globalQueryClient.invalidateQueries({
        queryKey: projectKeys.namespace,
      })
      await globalQueryClient.invalidateQueries({
        queryKey: resourcesKeys.namespace
      })
    },
  })
}

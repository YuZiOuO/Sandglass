import { useQuery, useMutation } from '@tanstack/vue-query'
import type { InferRequestType } from 'hono'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { cli, globalQueryClient, processHonoResponse, useAuthStatus } from './common'

export const resourcesKeys = {
  namespace: ['resources'] as const,
  project: (projectId: string) => [...resourcesKeys.namespace, projectId] as const,
}

export function useProjectResourcesQuery(projectId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(projectId))

  return useQuery({
    queryKey: computed(() => resourcesKeys.project(id.value)),
    queryFn: async () => {
      const resources = await cli.resource.$get({ query: { projectId: id.value } })
      return await processHonoResponse(resources)
    },
    enabled: () => useAuthStatus().value && !!id.value,
  })
}

export type ResourcesCreateDTO = InferRequestType<typeof cli.resource.$post>
export function useResourcesCreateMutation() {
  return useMutation({
    mutationFn: async (dto: ResourcesCreateDTO) => {
      const createdResource = await cli.resource.$post(dto)
      return await processHonoResponse(createdResource)
    },
    onSuccess: async (data) =>
      globalQueryClient.invalidateQueries({ queryKey: resourcesKeys.project(data.projectId) }),
  })
}

export function useResourcesDeleteMutation() {
  return useMutation({
    mutationFn: async (resourceId: string) => {
      const deletedResource = await cli.resource.$delete({ query: { resourceId: resourceId } })
      return await processHonoResponse(deletedResource)
    },
    onSuccess: async (data) =>
      globalQueryClient.invalidateQueries({ queryKey: resourcesKeys.project(data.projectId) }),
  })
}

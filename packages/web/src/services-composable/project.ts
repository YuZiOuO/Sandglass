import { useMutation, useQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { cli } from './common'
import type { InferRequestType } from 'hono'

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['project'],
    queryFn: async () => {
      const res = await cli.project.my.$get()
      return await res.json()
    },
  })
}

export function useProjectQuery(projectId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await cli.project.$get({ query: { id: toValue(projectId) } })
      return await res.json()
    },
  })
}

export function useProjectResourcesQuery(projectId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['project', projectId, 'resource'],
    queryFn: async () => {
      const resources = await cli.resource.$get({ query: { projectId: toValue(projectId) } })
      return await resources.json()
    },
  })
}

export type ProjectCreateDTO = InferRequestType<typeof cli.project.$post>['json']
export function useProjectCreateMutation() {
  return useMutation({
    mutationFn: async (dto: ProjectCreateDTO) => {
      const createdProject = await cli.project.$post({ json: { ...dto } })
      return await createdProject.json()
    },
  })
}

export type ResourcesCreateDTO = InferRequestType<typeof cli.resource.$post>
export function useResourcesCreateMutation() {
  return useMutation({
    mutationFn: async (dto: ResourcesCreateDTO) => {
      const createdResource = await cli.resource.$post(dto)
      return await createdResource.json()
    },
  })
}

export function useResourcesDeleteMutation() {
  return useMutation({
    mutationFn: async (resourceId: string) => {
      const deletedResource = await cli.resource.$delete({ query: { resourceId: resourceId } })
      return await deletedResource.json()
    },
  })
}

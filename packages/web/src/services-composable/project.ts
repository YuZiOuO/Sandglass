import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { cli } from './common'

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['project'],
    queryFn: async () => {
      const res = await cli.project.my.$get()
      return await res.json()
    },
  })
}

export function useProjectQuery(projectId: Ref<string>) {
  return useQuery({
    queryKey: ['project', projectId.value],
    queryFn: async (context) => {
      const id = context.queryKey[1]
      const res = await cli.project.$get({ json: { id: id } })
      return await res.json()
    },
  })
}

export function useProjectResourcesQuery(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId, 'resource'],
    queryFn: async () => {
      const resources = await cli.resource.$get({ query: { projectId: projectId } })
      return await resources.json()
    },
  })
}

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
    queryKey: ['calendar', projectId.value],
    queryFn: async (context) => {
      const id = context.queryKey[1]
      const res = await cli.project.$get({ json: { id: id } })
      return await res.json()
    },
  })
}

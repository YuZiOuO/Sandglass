import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { authClient } from './common'

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['project'],
    queryFn: async () => {
      const cli = await authClient()

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

      const cli = await authClient()
      const res = await cli.project.$get({ json: { id: id } })
      return await res.json()
    },
  })
}

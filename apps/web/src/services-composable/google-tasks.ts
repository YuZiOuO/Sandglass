import { useGApi } from '@/hooks/gapi'
import { useQuery } from '@tanstack/vue-query'
import { useGoogleAccessToken } from './google-oauth'
import type { Ref } from 'vue'

export function useTaskListsQuery() {
  return useQuery({
    queryKey: ['tasklists'],
    queryFn: async () => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasklists.list({
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
  })
}

export function useTasksQuery(TaskListId: Ref<string>) {
  return useQuery({
    queryKey: ['tasklists', TaskListId.value],
    queryFn: async (context) => {
      await useGApi(['tasks'])

      const id = context.queryKey[1]

      const req = gapi.client.tasks.tasks.list({
        tasklist: id,
        showHidden: true,
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
  })
}

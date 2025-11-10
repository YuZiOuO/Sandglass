import { useGApi } from '@/hooks/gapi'
import { useQuery } from '@tanstack/vue-query'
import { useGoogleAccessToken } from './google-oauth'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

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

export function useTasksQuery(TaskListId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['tasklists', TaskListId],
    queryFn: async () => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.list({
        tasklist: toValue(TaskListId),
        showHidden: true,
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
    enabled: computed(() => toValue(TaskListId).length > 0),
  })
}
